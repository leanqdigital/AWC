const container = document.getElementById("parentNotificationTemplatesInBody");
const displayedNotifications = new Set();
const readAnnouncements = new Set();
const pendingAnnouncements = new Set();
const cardMap = new Map();
const notificationIDs = new Set(); 
const notificationData = [];
function getQueryParamss(param) {
const urlParams = new URLSearchParams(window.location.search);
return urlParams.get(param);
}
const enrollID = getQueryParamss('eid');
function timeAgo(unixTimestamp) {
const now = new Date();
const date = new Date(unixTimestamp * 1000);
const seconds = Math.floor((now - date) / 1000);
let interval = Math.floor(seconds / 31536000);
if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
interval = Math.floor(seconds / 2592000);
if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
interval = Math.floor(seconds / 86400);
if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
interval = Math.floor(seconds / 3600);
if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
interval = Math.floor(seconds / 60);
if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
return "Just now";
}
async function fetchClassIds() {
const query = `
query calcEnrolments {
calcEnrolments(query: [{ where: { student_id: ${CONTACTss_ID} } }]) {
  Class_ID: field(arg: ["class_id"])
}
}
`;
try {
  const response = await fetch(HTTP_ENDPOINT, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Api-Key": APIii_KEY,
      },
      body: JSON.stringify({ query }),
  });
  const result = await response.json();
  if (result.data && result.data.calcEnrolments) {
      return result.data.calcEnrolments.map(enrolment => enrolment.Class_ID);
  }
  return [];
} catch (error) { 
  return [];
}
}
async function initializeSocket() {
    const classIds = await fetchClassIds(); 
    if (!classIds || classIds.length === 0) {
        return;
    }
    classIds.forEach((classId) => {
        const socket = new WebSocket(WS_ENDPOINT, "vitalstats");
        let keepAliveInterval;
        socket.onopen = () => {
            keepAliveInterval = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: "KEEP_ALIVE" }));
                }
            }, 28000);
            socket.send(JSON.stringify({ type: "connection_init" }));
            socket.send(
                JSON.stringify({
                    id: `subscription_${classId}`,
                    type: "GQL_START",
                    payload: {
                        query: SUBSCRIPTION_QUERY,
                        variables: {
                            author_id: LOGGED_IN_CONTACT_ID,
                            id: LOGGED_IN_CONTACT_ID,
                            class_id: classId,
                            created_at: createdAt,
                        },
                    },
                })
            );
        };
       socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type !== "GQL_DATA") return;
    if (!data.payload || !data.payload.data) {
        return;
    }
    const result = data.payload.data.subscribeToCalcAnnouncements;
    if (!result) {
      
        return;
    }
    const notifications = Array.isArray(result) ? result : [result];
    const filteredNotifications = notifications.filter(notification => {
        const postAuthor = notification.Post_Author_ID;
        const commentAuthor = notification.Comment_Author_ID;
        const instID = notification.Instructor_ID;
        const userId = Number(CONTACTss_ID);
        const notification_type = notification.Notification_Type;
        const enroll_std_id = notification.Enrolment_Student_ID;
        const post_Mention_Contact_Id = notification.Contact_Contact_ID;
        const announcement_mention_contact_id = notification.Mentions_Contact_ID;
        const submission_mention_contact_id =notification.Contact_Contact_ID1;

      
    switch (notification_type) {
    case "Posts":
        if ((user_Preference_Posts === "Yes" && notification.Post_Author_ID === userId) ||
            (user_Preference_Post_Mentions === "Yes" && notification.Contact_Contact_ID === userId)) {
            return false;
        } 
        break;

    case "Post Comments":
        if ((user_Preference_Post_Comments === "Yes" && notification.Comment_Author_ID === userId) ||
            (user_Preference_Post_Comment_Mentions === "Yes" && notification.Contact_Contact_ID === userId) || 
            (user_Preference_Comments_On_My_Posts === "Yes" && notification.Comment_Author_ID === userId)) {
            return false;
        }
        break;

    case "Submissions":
        if ((user_Preference_Submissions === "Yes" && notification.Enrolment_Student_ID === userId) ||
            (user_Preference_Submission_Mentions === "Yes" && notification.Contact_Contact_ID1 === userId)) {
            return false;
        }
        break;

    case "Submission Comments":
        if ((user_Preference_Submission_Comments === "Yes" && notification.Comment_Author_ID === userId) ||
            (user_Preference_Submission_Comment_Mentions === "Yes" && notification.Contact_Contact_ID1 === userId) || 
            (user_Preference_Comments_On_My_Submissions === "Yes" && notification.Comment_Author_ID === userId)) {
            return false;
        }
        break;

    case "Announcements":
        if ((user_Preference_Announcements === "Yes" && notification.Instructor_ID === userId) ||
            (user_Preference_Announcement_Mentions === "Yes" && notification.Mentions_Contact_ID === userId)) {
            return false;
        }
        break;

    case "Announcement Comments":
        if ((user_Preference_Announcement_Comments === "Yes" && notification.Comment_Author_ID === userId) ||
            (user_Preference_Announcement_Comment_Mentions === "Yes" && notification.Mentions_Contact_ID === userId) || 
            (user_Preference_Comments_On_My_Announcements === "Yes" && notification.Comment_Author_ID === userId)) {
            return false;
        }
        break;
}

return true;  
    });

    if (filteredNotifications.length === 0) {
       
        return;
    }
    filteredNotifications.forEach(notification => {
        processNotification(notification);
        notificationIDs.add(Number(notification.ID));
        notificationData.push(notification);
    });

    updateMarkAllReadVisibility();
};

        fetchReadDataForClass(classId);
        socket.onclose = () => {
            clearInterval(keepAliveInterval);
            setTimeout(() => initializeSocket(), 2000);
        };
        socket.onerror = (error) => {
           
        };
    });
}
initializeSocket();
function createNotificationCard(notification, isRead) {
const card = document.createElement("div");
  const notification_Type = notification.Notification_Type;
  const notification_course_name = notification.Course_Course_Name;
  const message = notification_Type === 'Posts' 
    ? `${notification_course_name} - A new post has been added` 
    : 'Dummy Title';
card.className = "notification-card cursor-pointer";
card.innerHTML = `
    <div data-my-id ="${notification.ID} "class="p-2  items-start gap-2 rounded justify-between notification-content w-full ${isRead ? "bg-white" : "bg-unread"} ${notification.Status==="Draft" ? "hidden":"flex" }">
        <div class="flex flex-col gap-1">
            <div class="text-[#414042] text-xs font-semibold">
            ${message}
            </div>
            <div class="extra-small-text text-dark line-clamp-2">${notification.Content}</div>
            <div class="text-[#586A80] extra-small-text">${notification.Course_Course_Name}</div>
        </div>
        <div class="extra-small-text text-[#586A80] text-nowrap">${timeAgo(notification.Date_Added)}</div>
    </div>
`;
card.addEventListener("click", async function () { 
  const id = Number(notification.ID);
  const type = notification.Type;
  const loader = document.getElementById("loader");
  loader.classList.remove("fade-out");
  if (!readAnnouncements.has(id) && !pendingAnnouncements.has(id)) {
      await markAsRead(id);
  }

  if (type === 'Comment' || type === 'Post') {
      window.location.href = `https://courses.writerscentre.com.au/students/course-details/${notification.Course_Unique_ID}?eid=${notification.EnrolmentID}&selectedTab=courseChat?current-post-id=${notification.Post_ID}`;
  } else if (type === 'Submissions') {
      window.location.href = `https://courses.writerscentre.com.au/course-details/content/${notification.Lesson_Unique_ID1}?eid=${notification.EnrolmentID}`;
  } else {
      window.location.href = `https://courses.writerscentre.com.au/students/course-details/${notification.Course_Unique_ID}?eid=${notification.EnrolmentID}&selectedTab=anouncemnt?data-announcement-template-id=${notification.ID}`;
  }
});

return card;
}

function processNotification(notification) {
    const container1 = document.getElementById("parentNotificationTemplatesInBody");
    const container2 = document.getElementById("secondaryNotificationContainer"); 

    const id = Number(notification.ID);
    if (displayedNotifications.has(id)) return;
    displayedNotifications.add(id);
    
    const isRead = readAnnouncements.has(id);
    const card = createNotificationCard(notification, isRead);
    
   
    container1.prepend(card);
    
    let cardClone = null;

    
    if (container2) {
        cardClone = createNotificationCard(notification, isRead);
        container2.prepend(cardClone);
    }

 
    cardMap.set(id, { original: card, clone: cardClone });

    
    updateNoNotificationMessages(); 
    updateNoNotificationMessagesSec();
}

function updateNotificationReadStatus() {
    cardMap.forEach((cards, id) => {
        if (readAnnouncements.has(id)) {
            [cards.original, cards.clone].forEach((card) => {
                if (card) {
                    card.querySelector(".notification-content").classList.remove("bg-unread");
                    card.querySelector(".notification-content").classList.add("bg-white");
                }
            });
        }
    });
}

function updateMarkAllReadVisibility() {
    let hasUnread = false;
    cardMap.forEach(({ original }) => {
        if (original && original.querySelector(".notification-content").classList.contains("bg-unread")) {
            hasUnread = true;
        }
    });
    const markAllReadElements = document.querySelectorAll(".hideMarkAllReadIfAllRead");
    const redDot = document.getElementById("redDot");
    markAllReadElements.forEach(el => {
        el.classList.toggle("hidden", !hasUnread);
    });
    if (redDot) {
        redDot.classList.toggle("hidden", !hasUnread);
    }
}


async function markAsRead(announcementId) {
    if (pendingAnnouncements.has(announcementId) || readAnnouncements.has(announcementId)) return;
    pendingAnnouncements.add(announcementId);

    const variables = {
        payload: {
            read_announcement_id: announcementId,
            read_contact_id: LOGGED_IN_CONTACT_ID,
        },
    };

    try {
        const response = await fetch(HTTP_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": APIii_KEY,
            },
            body: JSON.stringify({
                query: MARK_READ_MUTATION,
                variables: variables,
            }),
        });

        const data = await response.json();
        pendingAnnouncements.delete(announcementId);
        if (data.data && data.data.createOReadContactReadAnnouncement) {
            readAnnouncements.add(announcementId);

            updateNotificationReadStatus();
            updateMarkAllReadVisibility(); 
            updateNoNotificationMessages(); 
            updateNoNotificationMessagesSec();
        }
    } catch (error) {
        pendingAnnouncements.delete(announcementId);
       
    }
}

function markAllAsRead() {
    let hasUnread = false;
    cardMap.forEach((cards, id) => {
        if (!readAnnouncements.has(id) && !pendingAnnouncements.has(id)) {
            hasUnread = true;
            markAsRead(id);
        }
    });
   
    updateMarkAllReadVisibility();
    updateNoNotificationMessages(); 
    updateNoNotificationMessagesSec();
}

document.addEventListener("DOMContentLoaded", () => {
const markAllBtn = document.getElementById("markEveryAsRead");
if (markAllBtn) {
    markAllBtn.addEventListener("click", markAllAsRead);
   
} else {
    
}
});

function fetchReadDataForClass(classId) {    
    fetch(HTTP_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Api-Key": APIii_KEY,
        },
        body: JSON.stringify({
            query: READ_QUERY,
            variables: { class_id: classId }
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.data && data.data.calcOReadContactReadAnnouncements) {
            const records = Array.isArray(data.data.calcOReadContactReadAnnouncements)
                ? data.data.calcOReadContactReadAnnouncements
                : [data.data.calcOReadContactReadAnnouncements];

            records.forEach((record) => {
                if (Number(record.Read_Contact_ID) === Number(LOGGED_IN_CONTACT_ID)) {
                    readAnnouncements.add(Number(record.Read_Announcement_ID));
                }
            });

            updateNotificationReadStatus();
            updateNoNotificationMessages(); 
            updateNoNotificationMessagesSec();
        }
    })
    .catch((error) => {
       
    });
}
function updateNoNotificationMessages() {
    const noAllMessage = document.getElementById("noAllMessage");
    const noAnnouncementsMessage = document.getElementById("noAnnouncementsMessage");
    if (!noAllMessage || !noAnnouncementsMessage) return; 

    const visibleCards = [...cardMap.values()].filter(({ original }) => 
        original && !original.classList.contains("hidden")
    );
    const hasNotifications = visibleCards.length > 0;
    noAllMessage.classList.toggle("hidden", hasNotifications);
    noAnnouncementsMessage.classList.add("hidden");
}

function updateNoNotificationMessagesSec() {
    const noAllMessageSec = document.getElementById("noAllMessageSec");
    const noAnnouncementsMessageSec = document.getElementById("noAnnouncementsMessageSec");
    if (!noAllMessageSec || !noAnnouncementsMessageSec) return; 
    const hasVisible = [...cardMap.values()].some(({ clone }) =>  clone && !clone.classList.contains("hidden")
    );
    noAllMessageSec.classList.toggle("hidden", hasVisible);
    noAnnouncementsMessageSec.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
    const onlySeeBtn = document.getElementById("OnlyseeAnnouncements");
    const noAllMessage = document.getElementById("noAllMessage");
    const showAllBtn = document.getElementById("allAnnouncements");
    const noAnnouncementsMessage = document.getElementById("noAnnouncementsMessage");
    const showUnreadAnnounceBtn = document.getElementById("showUnreadAnnouncement");
    const showUnreadAllNotification = document.getElementById("showUnreadAllNotification");
    let showUnreadMode = false;
    let showUnreadAllMode = false;
   function toggleVisibilityAll() {
    let hasData = false;
    showUnreadAllMode = false;
    showUnreadMode = false;

    cardMap.forEach(({ original }) => {
        if (original) {
            original.classList.remove("hidden");
            hasData = true; 
        }
    });
    noAllMessage.classList.toggle("hidden", hasData);
    noAnnouncementsMessage.classList.add("hidden"); 
}

function toggleVisibilityByType(type) {
    let hasAnnouncements = false;

    showUnreadAllMode = false;
    showUnreadMode = false;

    cardMap.forEach(({ original }, id) => {
        const notification = notificationData.find(n => Number(n.ID) === id);
        if (!notification) return;

        const shouldShow = notification.Type === type;
        if (original) {
            original.classList.toggle("hidden", !shouldShow);
        }

        if (shouldShow) hasAnnouncements = true;
    });

   
    noAnnouncementsMessage.classList.toggle("hidden", hasAnnouncements);
    noAllMessage.classList.add("hidden"); 
}

function toggleUnreadAnnouncements() {
    showUnreadMode = !showUnreadMode;
    let hasUnread = false;
    let hasVisible = false;

    cardMap.forEach(({ original }, id) => {
        const notification = notificationData.find(n => Number(n.ID) === id);
        if (!notification) return;

        if (notification.Type === "Announcement") {
            const isUnread = original.querySelector(".notification-content").classList.contains("bg-unread");

            if (original) {
                original.classList.toggle("hidden", showUnreadMode && !isUnread);
                if (!original.classList.contains("hidden")) {
                    hasVisible = true;
                }
            }

            if (isUnread) hasUnread = true;
        }
    });

    
    noAnnouncementsMessage.classList.toggle("hidden", hasVisible);
    noAllMessage.classList.add("hidden"); 
}

function toggleUnreadNotifications() {
    showUnreadAllMode = !showUnreadAllMode;
    let hasUnread = false;
    let hasVisible = false;

    cardMap.forEach(({ original }) => {
        const isUnread = original.querySelector(".notification-content").classList.contains("bg-unread");

        if (original) {
            original.classList.toggle("hidden", showUnreadAllMode && !isUnread);
            if (!original.classList.contains("hidden")) {
                hasVisible = true;
            }
        }

        if (isUnread) hasUnread = true;
    });

 
    noAllMessage.classList.toggle("hidden", hasVisible);
    noAnnouncementsMessage.classList.add("hidden"); 
}
    onlySeeBtn.addEventListener("click", () => toggleVisibilityByType("Announcement"));
    showAllBtn.addEventListener("click", toggleVisibilityAll);
    showUnreadAnnounceBtn.addEventListener("click", toggleUnreadAnnouncements);
    showUnreadAllNotification.addEventListener("click", toggleUnreadNotifications);
});

document.addEventListener("DOMContentLoaded", function () {
    const onlySeeBtnSec = document.getElementById("OnlyseeAnnouncementsSec");
    const noAllMessageSec = document.getElementById("noAllMessageSec");
    const showAllBtnSec = document.getElementById("allAnnouncementsSec");
    const noAnnouncementsMessageSec = document.getElementById("noAnnouncementsMessageSec");
    const showUnreadAnnounceBtnSec = document.getElementById("showUnreadAnnouncementSec");
    const showUnreadAllNotificationSec = document.getElementById("showUnreadAllNotificationSec");
    let showUnreadModeSec = false;
    let showUnreadAllModeSec = false;
    function toggleVisibilityByTypeSec(type) {
        let hasAnnouncements = false;

        showUnreadAllModeSec = false;
        showUnreadModeSec = false;

        cardMap.forEach(({ clone }, id) => {
            const notification = notificationData.find(n => Number(n.ID) === id);
            if (!notification) return;

            const shouldShow = notification.Type === type;
            if (clone) {
                clone.classList.toggle("hidden", !shouldShow);
            }
            if (shouldShow) hasAnnouncements = true;
        });

        noAnnouncementsMessageSec.classList.toggle("hidden", hasAnnouncements);
        noAllMessageSec.classList.add("hidden"); 
    }
    function toggleVisibilityAllSec() {
        let hasData = false;

        showUnreadAllModeSec = false;
        showUnreadModeSec = false;

        cardMap.forEach(({ clone }) => {
            if (clone) {
                clone.classList.remove("hidden");
                hasData = true;
            }
        });
        noAllMessageSec.classList.toggle("hidden", hasData);
        noAnnouncementsMessageSec.classList.add("hidden"); 
    }
    function toggleUnreadAnnouncementsSec() {
        showUnreadModeSec = !showUnreadModeSec;
        let hasUnread = false;
        let hasVisible = false;

        cardMap.forEach(({ clone }, id) => {
            const notification = notificationData.find(n => Number(n.ID) === id);
            if (!notification) return;

            if (notification.Type === "Announcement") {
                const isUnread = clone?.querySelector(".notification-content")?.classList.contains("bg-unread");

                if (clone) {
                    clone.classList.toggle("hidden", showUnreadModeSec && !isUnread);
                    if (!clone.classList.contains("hidden")) {
                        hasVisible = true;
                    }
                }

                if (isUnread) hasUnread = true;
            }
        });
        noAnnouncementsMessageSec.classList.toggle("hidden", hasVisible);
        noAllMessageSec.classList.add("hidden"); 
    }
    function toggleUnreadNotificationsSec() {
        showUnreadAllModeSec = !showUnreadAllModeSec;
        let hasUnread = false;
        let hasVisible = false;

        cardMap.forEach(({ clone }) => {
            const isUnread = clone?.querySelector(".notification-content")?.classList.contains("bg-unread");

            if (clone) {
                clone.classList.toggle("hidden", showUnreadAllModeSec && !isUnread);
                if (!clone.classList.contains("hidden")) {
                    hasVisible = true;
                }
            }

            if (isUnread) hasUnread = true;
        });
        noAllMessageSec.classList.toggle("hidden", hasVisible);
        noAnnouncementsMessageSec.classList.add("hidden");
    }

if (onlySeeBtnSec) {
        onlySeeBtnSec.addEventListener("click", () => toggleVisibilityByTypeSec("Announcement"));
    }
    if (showAllBtnSec) {
        showAllBtnSec.addEventListener("click", toggleVisibilityAllSec);
    }
    if (showUnreadAnnounceBtnSec) {
        showUnreadAnnounceBtnSec.addEventListener("click", toggleUnreadAnnouncementsSec);
    }
    if (showUnreadAllNotificationSec) {
        showUnreadAllNotificationSec.addEventListener("click", toggleUnreadNotificationsSec);
    }
  
});
document.addEventListener("DOMContentLoaded", function () {
    updateMarkAllReadVisibility(); 
    updateNoNotificationMessages(); 
    updateNoNotificationMessagesSec();
});

