
    //==========GLOBAL VARIABLE STARTS HERE====================//
    const apiUrl = "https://awc.vitalstats.app/api/v1/graphql";
    const apiKey = "mMzQezxyIwbtSc85rFPs3";
    let userVotesMap = {};
    window.voteCountMap = {};
    let replyUserVotesMap = {};
    window.replyVoteCountMap = {};
    const DEFAULT_AVATAR =
        "https://file.ontraport.com/media/41ca85f5cdde4c12bf72c2c73747633f.phpkeya0n?Expires=4884400377&Signature=SnfrlziQIcYSbZ98OrH2guVWpO4BRcxatgk3lM~-mKaAencWy7e1yIuxDT4hQjz0hFn-fJ118InfvymhaoqgGxn63rJXeqJKB4JTkYauub5Jh5UO3z6S0o~RVMj8AMzoiImsvQoPuRK7KnuOAsGiVEmSsMHEiM69IWzi4dW~6pryIMSHQ9lztg1powm8b~iXUNG8gajRaQWxlTiSyhh-CV-7zkF-MCP5hf-3FAKtGEo79TySr5SsZApLjfOo-8W~F8aeXK8BGD3bX6T0U16HsVeu~y9gDCZ1lBbLZFh8ezPL~4gktRbgP59Us8XLyV2EKn6rVcQCsVVUk5tUVnaCJw__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA";
    const announcementWrapper = document.querySelector("#announcementWrapper");

    //=======FALLBACK IMAGE FUNCTION=========================//
    function formatProfileImage(imageUrl) {
        return imageUrl || DEFAULT_AVATAR;
    }

    //==========FORMAT TIME FUNCTIONS=======================//
    function formatDateTimeFromUnix(timestamp) {
        if (!timestamp || isNaN(timestamp)) return "Unknown Date";
        const inputDate = new Date(timestamp * 1000);
        if (isNaN(inputDate.getTime())) return "Unknown Date";

        const now = new Date();
        const differenceInSeconds = Math.floor((now - inputDate) / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInSeconds < 60) return `${differenceInSeconds} seconds ago`;
        if (differenceInMinutes < 60) return `${differenceInMinutes} minutes ago`;
        if (differenceInHours < 24) return `${differenceInHours} hours ago`;

        return inputDate.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }
 
    //==========FORMAT TIME FUNCTIONS=======================//
    function formatUnixTimestamp(unixTimestamp) {
        if (!unixTimestamp || isNaN(unixTimestamp)) return "Invalid Date";
        const date = new Date(unixTimestamp * 1000);
        if (isNaN(date.getTime())) return "Invalid Date";

        return date.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }
    //=========== FETCH ALL ANNOUNCEMENTS ==================//
    // --- UPDATED FETCH FUNCTION ---
    async function fetchAllAnnouncements(classID, tab = "all") {
     
        let whereClause;
        if (tab === "scheduled") {
            whereClause = `{ 
        Class: [{ where: { id: $id } }], 
        status: "Draft" 
      }`;
        } else {
            whereClause = `{ 
        Class: [{ where: { id: $id } }] 
      }`;
        }

        const query = `
      query calcAnnouncements($id: AwcClassID, $limit: IntScalar, $offset: IntScalar) {
        calcAnnouncements(
          query: [{ where: ${whereClause} }]
          limit: $limit
          offset: $offset
          orderBy: [{ path: ["created_at"], type: desc }]
        ) {
          ID: field(arg: ["id"])
          Title: field(arg: ["title"])
          Content: field(arg: ["content"])
          Date_Added: field(arg: ["created_at"])
          Instructor_ID: field(arg: ["instructor_id"])
          Instructor_First_Name: field(arg: ["Instructor", "first_name"])
          Instructor_Last_Name: field(arg: ["Instructor", "last_name"]) 
          Instructor_Display_Name: field(arg: ["Instructor", "display_name"]) 
          Instructor_Profile_Image: field(arg: ["Instructor", "profile_image"])
          Disable_Comments: field(arg: ["disable_comments"])
          Status: field(arg: ["status"])
          Post_Later_Date_Time: field(arg: ["post_later_date_time"])
          Attachment: field(arg: ["attachment"])
          Contact_Who_Up_Voted_This_Announcements_DataTotal_Count: countDistinct(
            args: [
              { field: ["Contact_Who_Up_Voted_This_Announcements_Data", "id"] }
            ]
          )
        }
      }
    `;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({
                    query,
                    variables: { id: classID, limit: 5000, offset: 0 },
                }),
            });
            if (!response.ok) throw new Error("Failed to fetch announcements.");
            const data = await response.json();
            return data?.data?.calcAnnouncements || [];
        } catch (error) {
            return [];
        }
    }
    //===== FETCH USER VOTES FUNCTION ===================//
    async function fetchUserVotes() {
        const query = `
              query calcContactVotedAnnouncements {
                calcContactVotedAnnouncements {
                  ID: field(arg: ["id"])
                  Announcement_ID: field(arg: ["Announcement_That_This_Contact_Has_Up_Voted", "id"])
                  Contact_ID: field(arg: ["Contact_Who_Up_Voted_This_Announcement", "id"])
                }
              }
            `;
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            return data?.data?.calcContactVotedAnnouncements || [];
        } catch (error) {
            return [];
        }
    }

    // ========= INITIALIZE VOTES =========
//     async function initializeUserVotes() {
//         const votes = await fetchUserVotes();
//         // Build a map for unique votes and the logged in user's vote records.
//         const uniqueVotes = {};
//         userVotesMap = {};

//         votes.forEach((vote) => {
//             const annId = vote.Announcement_ID;
//             // Build a set of unique contact IDs per announcement.
//             if (!uniqueVotes[annId]) {
//                 uniqueVotes[annId] = new Set();
//             }
//             uniqueVotes[annId].add(vote.Contact_ID);
//             // If the vote is from the logged-in user, store the vote ID.
//             if (parseInt(vote.Contact_ID) === parseInt(LOGGED_IN_USER_ID)) {
//                 if (!userVotesMap[annId]) {
//                     userVotesMap[annId] = [];
//                 }
//                 userVotesMap[annId].push(vote.ID);
//             }
//         });

//         // Build a unique vote count map.
//         for (const annId in uniqueVotes) {
//             window.voteCountMap[annId] = uniqueVotes[annId].size;
//         }
//     }
//   function gatherMentionsFromElementt(el) {
//         const mentionEls = el.querySelectorAll(".mention-handle[data-mention-id]");
//         return [...mentionEls].map(m => ({ id: Number(m.getAttribute("data-mention-id")) }));
//     }

//     //============ RENDER ANNOUNCEMENTS ======================//
//     async function renderAnnouncements(announcements) {
//         // First, format announcement properties.
//         await initializeUserVotes();
//         announcements.forEach((a) => {
//             if (a.Attachment) {
//                 a.Instructor_Profile_Image = formatProfileImage(
//                     a.Instructor_Profile_Image
//                 );
//                 a.hasVoted = userVotesMap[a.ID] && userVotesMap[a.ID].length > 0;
//                 a.voteCount = window.voteCountMap[a.ID] || 0;
//                 try {
//                     a.attachmentObject = typeof a.Attachment === 'object'
//                         ? a.Attachment
//                         : JSON.parse(a.Attachment);
//                 } catch (e) {
//                     // If parsing fails, use the raw value as the link and a default name.
//                     a.attachmentObject = { link: a.Attachment, name: 'View File' };
//                 }
//             } else {
//                 a.attachmentObject = {};
//             }
//             a.Date_Added = formatDateTimeFromUnix(a.Date_Added);
//             a.Post_Later_Date_Time = a.Post_Later_Date_Time
//                 ? formatUnixTimestamp(a.Post_Later_Date_Time)
//                 : "";
//             a.Instructor_Profile_Image = formatProfileImage(
//                 a.Instructor_Profile_Image
//             );
//             a.isOwner = String(a.Instructor_ID) === String(LOGGED_IN_USER_ID);
//             a.hasVoted = userVotesMap[a.ID] && userVotesMap[a.ID].length > 0;
//             a.voteCount = window.voteCountMap[a.ID] || 0;
//         });
//         const filteredAnnouncements = announcements.filter(
//             (a) =>
//                 a.Status === "Published" ||
//                 String(a.Instructor_ID) === String(LOGGED_IN_USER_ID)
//         );
//         if (filteredAnnouncements.length === 0) {
//             $("#announcementWrapper").html(`
//           <div class="no-announcements-message text-center p-4">
//             <img src="https://files.ontraport.com/media/b8d3dce261494ac7aa221272e345d9d0.php4gxupm?Expires=4895379185&Signature=Z5usQNuPkbcpJElvMSyxEwpvyQrTPkmUuAPqz32DV8GFwg8IBgYiUBya2xr~fUA775bPsPMBPioe9-7HJtyGVKwrnu3XU3I4MU-L0MhQli84rt1tfZnMd2VQh754zY5IxeS~s5bzKdKQA~X-j4TFdoM1n~mlJrdNVKcgNg6uTv3yKsHNjNcwcJXt6pJHFHk7agtRgAkOzugjFrmwFp~XwjDjN8AsuiWoy8P5vvlwMjUYIXy4Zzg7LHXWZ4fpSy1ur8z8ETI0mWpoNkinNAoJarKcMCDaQ-SUrXe7AxeKww0d~aSdd9SXbKpy1h5LBIgEzI5LEV27EhI1r2qzJpXTQw__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA">
//           </div>
//         `);
//             return;
//         }
//         const template = $.templates("#announcementTemplate");
//         $("#announcementWrapper").html(template.render(filteredAnnouncements));
//         filteredAnnouncements.forEach((a) => {
//             const voteCounter = document.querySelector(`#vote-${a.ID} .voteCounter`);
//             if (voteCounter) {
//                 voteCounter.textContent = a.voteCount;
//             }
//         });
//         for (const a of filteredAnnouncements) {
//             const replies = await fetchRepliesForAnnouncement(a.ID);
//             const announcementEl = document.querySelector(
//                 `[data-announcement-template-id="${a.ID}"]`
//             );
//             let repliesContainer = announcementEl.querySelector(".repliesContainer");
//             // Create the replies container if it doesn't exist
//             if (!repliesContainer) {
//                 repliesContainer = document.createElement("div");
//                 repliesContainer.className =
//                     "repliesContainer w-full flex flex-col gap-4";
//                 announcementEl.appendChild(repliesContainer);
//             }
//             repliesContainer.innerHTML = "";
//         //     replies.forEach((reply) => {
//         //         reply.Date_Added = formatDateTimeFromUnix(reply.Date_Added);
//         //         reply.Author_Profile_Image = formatProfileImage(
//         //             reply.Author_Profile_Image
//         //         );
//         //         reply.isOwner = String(reply.Author_ID) === String(LOGGED_IN_USER_ID);
//         //         reply.hasVoted =
//         //             replyUserVotesMap[reply.ID] && replyUserVotesMap[reply.ID].length > 0;
//         //         reply.voteCount = window.replyVoteCountMap[reply.ID] || 0;
//         //         renderReply(a.ID, reply);
//         // }

//             replies.forEach(async (reply) => {
//     reply.Date_Added = formatDateTimeFromUnix(reply.Date_Added);
//     reply.Author_Profile_Image = formatProfileImage(reply.Author_Profile_Image);
//     reply.isOwner = String(reply.Author_ID) === String(LOGGED_IN_USER_ID);
//     reply.hasVoted = replyUserVotesMap[reply.ID] && replyUserVotesMap[reply.ID].length > 0;
//     reply.voteCount = window.replyVoteCountMap[reply.ID] || 0;
    
//     renderReply(a.ID, reply);

//     // 🔁 Fetch replies to this reply (nested replies)
//     const nestedReplies = await fetchRepliesForAnnouncement(reply.ID);

//     nestedReplies.forEach((nestedReply) => {
//         nestedReply.Date_Added = formatDateTimeFromUnix(nestedReply.Date_Added);
//         nestedReply.Author_Profile_Image = formatProfileImage(nestedReply.Author_Profile_Image);
//         nestedReply.isOwner = String(nestedReply.Author_ID) === String(LOGGED_IN_USER_ID);
//         nestedReply.hasVoted = replyUserVotesMap[nestedReply.ID] && replyUserVotesMap[nestedReply.ID].length > 0;
//         nestedReply.voteCount = window.replyVoteCountMap[nestedReply.ID] || 0;

//         renderReply(reply.ID, nestedReply); // Attach to the parent reply
//     });
// });
//         }
//     }


async function renderAnnouncements(announcements) {
    await initializeUserVotes();
    announcements.forEach((a) => {
        if (a.Attachment) {
            a.Instructor_Profile_Image = formatProfileImage(a.Instructor_Profile_Image);
            a.hasVoted = userVotesMap[a.ID] && userVotesMap[a.ID].length > 0;
            a.voteCount = window.voteCountMap[a.ID] || 0;
            try {
                a.attachmentObject = typeof a.Attachment === 'object' ? a.Attachment : JSON.parse(a.Attachment);
            } catch (e) {
                a.attachmentObject = { link: a.Attachment, name: 'View File' };
            }
        } else {
            a.attachmentObject = {};
        }
        a.Date_Added = formatDateTimeFromUnix(a.Date_Added);
        a.Post_Later_Date_Time = a.Post_Later_Date_Time ? formatUnixTimestamp(a.Post_Later_Date_Time) : "";
        a.Instructor_Profile_Image = formatProfileImage(a.Instructor_Profile_Image);
        a.isOwner = String(a.Instructor_ID) === String(LOGGED_IN_USER_ID);
        a.hasVoted = userVotesMap[a.ID] && userVotesMap[a.ID].length > 0;
        a.voteCount = window.voteCountMap[a.ID] || 0;
    });

    const filteredAnnouncements = announcements.filter(
        (a) => a.Status === "Published" || String(a.Instructor_ID) === String(LOGGED_IN_USER_ID)
    );

    if (filteredAnnouncements.length === 0) {
        $("#announcementWrapper").html(`
            <div class="no-announcements-message text-center p-4">
                <img src="https://files.ontraport.com/media/b8d3dce261494ac7aa221272e345d9d0.php4gxupm?Expires=4895379185&Signature=Z5usQNuPkbcpJElvMSyxEwpvyQrTPkmUuAPqz32DV8GFwg8IBgYiUBya2xr~fUA775bPsPMBPioe9-7HJtyGVKwrnu3XU3I4MU-L0MhQli84rt1tfZnMd2VQh754zY5IxeS~s5bzKdKQA~X-j4TFdoM1n~mlJrdNVKcgNg6uTv3yKsHNjNcwcJXt6pJHFHk7agtRgAkOzugjFrmwFp~XwjDjN8AsuiWoy8P5vvlwMjUYIXy4Zzg7LHXWZ4fpSy1ur8z8ETI0mWpoNkinNAoJarKcMCDaQ-SUrXe7AxeKww0d~aSdd9SXbKpy1h5LBIgEzI5LEV27EhI1r2qzJpXTQw__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA">
            </div>
        `);
        return;
    }

    const template = $.templates("#announcementTemplate");
    $("#announcementWrapper").html(template.render(filteredAnnouncements));

    filteredAnnouncements.forEach((a) => {
        const voteCounter = document.querySelector(`#vote-${a.ID} .voteCounter`);
        if (voteCounter) {
            voteCounter.textContent = a.voteCount;
        }
    });

    for (const a of filteredAnnouncements) {
        const replies = await fetchRepliesForAnnouncement(a.ID);
        const announcementEl = document.querySelector(`[data-announcement-template-id="${a.ID}"]`);
        let repliesContainer = announcementEl.querySelector(".repliesContainer");

        if (!repliesContainer) {
            repliesContainer = document.createElement("div");
            repliesContainer.className = "repliesContainer w-full flex flex-col gap-4";
            announcementEl.appendChild(repliesContainer);
        }

        repliesContainer.innerHTML = "";

        for (const reply of replies) {
            reply.Date_Added = formatDateTimeFromUnix(reply.Date_Added);
            reply.Author_Profile_Image = formatProfileImage(reply.Author_Profile_Image);
            reply.isOwner = String(reply.Author_ID) === String(LOGGED_IN_USER_ID);
            reply.hasVoted = replyUserVotesMap[reply.ID] && replyUserVotesMap[reply.ID].length > 0;
            reply.voteCount = window.replyVoteCountMap[reply.ID] || 0;

            renderReply(a.ID, reply);

            const nestedReplies = await fetchRepliesForAnnouncement(reply.ID);

            for (const nestedReply of nestedReplies) {
                nestedReply.Date_Added = formatDateTimeFromUnix(nestedReply.Date_Added);
                nestedReply.Author_Profile_Image = formatProfileImage(nestedReply.Author_Profile_Image);
                nestedReply.isOwner = String(nestedReply.Author_ID) === String(LOGGED_IN_USER_ID);
                nestedReply.hasVoted = replyUserVotesMap[nestedReply.ID] && replyUserVotesMap[nestedReply.ID].length > 0;
                nestedReply.voteCount = window.replyVoteCountMap[nestedReply.ID] || 0;

                renderRepliesOfReply(reply.ID, nestedReply);
            }
        }
    }
}

    //================ PREPEND ANNOUNCEMENT FUNCTION ==========//
    function prependAnnouncement(announcement) {
        if (announcement.Attachment) {
            try {
                announcement.attachmentObject =
                    JSON.parse(announcement.Attachment) || {};
            } catch (e) {
                announcement.attachmentObject = {};
            }
        } else {
            announcement.attachmentObject = {};
        }

        const template = $.templates("#announcementTemplate");
        $("#announcementWrapper").prepend(template.render([announcement]));

        announcementWrapper.firstElementChild.classList.add(
            "opacity-50",
            "pointer-events-none"
        );
    }
    //=======================================================//

    //=========== EVENT DELEGATION FOR ACTION ITEMS ==========//
    document.addEventListener("click", (event) => {
        const toggleButton = event.target.closest(".actionToggleButton");
        if (toggleButton) {
            const wrapper = toggleButton.querySelector(".actionItemsWrapper");
            document.querySelectorAll(".actionItemsWrapper").forEach((item) => {
                if (item !== wrapper) item.classList.add("hidden");
            });
            if (wrapper) wrapper.classList.toggle("hidden");
        } else {
            document
                .querySelectorAll(".actionItemsWrapper")
                .forEach((item) => item.classList.add("hidden"));
        }
        const replyToggler = event.target.closest(".reply-form-toggler");
        if (replyToggler) {
            // Find the closest container that holds the toggler.
            const container = replyToggler.closest(".formTogglerButtonContainer");

            if (container) {
                const form = container.parentElement.querySelector(".replyForm");
                if (form) {
                    setTimeout(() => {
                        form.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Find the textarea and add focus to it
                        const textarea = form.querySelector("textarea");
                        if (textarea) {
                            textarea.focus();
                        }
                    }, 100);
                    form.classList.toggle("hidden");
                }
            }
        }

    });
    //=======================================================//

    //=========== VOTE BUTTON HANDLER ==============//
    document.addEventListener("click", async (e) => {
        const voteBtn = e.target.closest(".voteButton");
        if (!voteBtn) return;

        // Force announcementId to be a string
        const announcementId = String(voteBtn.id.replace("vote-", ""));
        const voteCountElem = voteBtn.querySelector(".voteCounter");

        voteBtn.style.opacity = "50%";
        voteBtn.style.pointerEvents = "none";

        try {
            // If the user has already voted for this announcement...
            if (
                userVotesMap[announcementId] &&
                userVotesMap[announcementId].length > 0
            ) {
                // Delete all vote records for this announcement by the logged-in user concurrently.
                const deletePromises = userVotesMap[announcementId].map((voteId) => {
                    const mutation = `
                    mutation deleteContactVotedAnnouncement($id: AwcContactVotedAnnouncementID) {
                      deleteContactVotedAnnouncement(query: [{ where: { id: $id } }]) { id }
                    }
                  `;
                    return fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                        body: JSON.stringify({
                            query: mutation,
                            variables: { id: voteId },
                        }),
                    }).then((res) => res.json());
                });

                const results = await Promise.all(deletePromises);

                // Regardless of how many records were deleted, subtract only 1 (since unique vote count is one per user).
                window.voteCountMap[announcementId] = Math.max(
                    (window.voteCountMap[announcementId] || 1) - 1,
                    0
                );
                voteCountElem.textContent = window.voteCountMap[announcementId];
                voteBtn.classList.remove("voted");
                delete userVotesMap[announcementId];
            } else {
                // User has not voted: create a vote record.
                const mutation = `
                  mutation createContactVotedAnnouncement($payload: ContactVotedAnnouncementCreateInput = null) {
                    createContactVotedAnnouncement(payload: $payload) {
                      ID: id
                      announcement_that_this_contact_has_up_voted_id
                      contact_who_up_voted_this_announcement_id
                    }
                  }
                `;
                const payload = {
                    announcement_that_this_contact_has_up_voted_id: announcementId,
                    contact_who_up_voted_this_announcement_id: LOGGED_IN_USER_ID,
                };

                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                    body: JSON.stringify({ query: mutation, variables: { payload } }),
                });
                const result = await response.json();

                if (result.data?.createContactVotedAnnouncement) {
                    // Save the vote record ID. (We only need one unique vote per user per announcement.)
                    userVotesMap[announcementId] = [
                        result.data.createContactVotedAnnouncement.ID,
                    ];
                    window.voteCountMap[announcementId] =
                        (window.voteCountMap[announcementId] || 0) + 1;
                    voteCountElem.textContent = window.voteCountMap[announcementId];
                    voteBtn.classList.add("voted");

                }
            }
        } catch (error) {
        } finally {
            voteBtn.style.opacity = "100%";
            voteBtn.style.pointerEvents = "";
        }
    });
    // Fetch replies for a specific announcement
    async function fetchRepliesForAnnouncement(announcementID) {
        const query = `
                      query calcForumComments(
                      $parent_announcement_id: AwcAnnouncementID
                      ) {
                      calcForumComments(
                          orderBy: [{ path: ["created_at"], type: asc }]
                          query: [
                          {
                              where: {
                              parent_announcement_id: $parent_announcement_id
                              }
                          }
                          ]
                      ) {
                          ID: field(arg: ["id"])
                          Author_ID: field(arg: ["author_id"]) 
                           Author_Display_Name: field(arg: ["Author", "display_name"]) 
                          Author_First_Name: field(arg: ["Author", "first_name"])
                          Author_Last_Name: field(arg: ["Author", "last_name"])
                          Author_Profile_Image: field(arg: ["Author", "profile_image"])
                          Date_Added: field(arg: ["created_at"])
                          Comment: field(arg: ["comment"])
                      }
                      }
          `;
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({
                    query,
                    variables: { parent_announcement_id: announcementID },
                }),
            });
            if (!response.ok) throw new Error("Failed to fetch replies.");
            const data = await response.json();
            return data?.data?.calcForumComments || [];
        } catch (error) {
            return [];
        }
    }

    //===== CREATE REPLY FUNCTION =====//
    async function createReplyAnnouncement(announcementID, comment, mentions) {
        const query = `
              mutation createForumComment($payload: ForumCommentCreateInput = null) {
                  createForumComment(payload: $payload) {
                      ID: id
                      author_id
                      comment
                      parent_announcement_id
                          Mentions {
                                    id
                    }
                  }
              }
          `;
        const payload = {
            comment,
            author_id: LOGGED_IN_USER_ID,
            parent_announcement_id: announcementID,
            Mentions:mentions
        };


        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({ query, variables: { payload } }),
            });
            const data = await response.json();
            return data?.data?.createForumComment || null;
        } catch (error) {
            return null;
        }
    }
    //===== CREATE REPLY FUNCTION =====//

    function appendHTML(container, html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        while (tempDiv.firstChild) {
            container.appendChild(tempDiv.firstChild);
        }
    }

    //===== RENDER REPLY FUNCTION =====//
    async function renderReply(announcementID, reply) {
        const announcementEl = document.querySelector(
            `[data-announcement-template-id="${announcementID}"]`
        );
        if (!announcementEl) return;

        let repliesContainer = announcementEl.querySelector(".repliesContainer");
        if (!repliesContainer) {
            repliesContainer = document.createElement("div");
            repliesContainer.className =
                "repliesContainer w-full flex flex-col gap-4";
            announcementEl.appendChild(repliesContainer);
        }

        const template = $.templates("#replyTemplateAnnouncement");
        const replyHTML = template.render(reply);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = replyHTML;
        repliesContainer.appendChild(tempDiv.firstElementChild);

        // ** Fix: Ensure correct vote count is displayed **
        const voteButton = tempDiv.querySelector(".replyVoteButton");
        if (voteButton) {
            const replyId = reply.ID;
            const voteCounter = voteButton.querySelector(".replyVoteCounter");
        }

        await initializeReplyVotes();
    }




        // Newly added
         //===== RENDER REPLY FUNCTION =====//
    async function renderRepliesOfReply(announcementID, reply) {
        const announcementEl = document.querySelector(
            `[data-reply-id="${announcementID}"]`
        );
        if (!announcementEl) return;

        let repliesContainer = announcementEl.querySelector(".repliesOfReplyContainer");
        if (!repliesContainer) {
            repliesContainer = document.createElement("div");
            repliesContainer.className =
                "repliesOfReplyContainer w-full flex flex-col gap-4";
            announcementEl.appendChild(repliesContainer);
        }

        const template = $.templates("#repliesOfReplyTemplateAnnouncement");
        const replyHTML = template.render(reply);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = replyHTML;
        repliesContainer.appendChild(tempDiv.firstElementChild);

        // ** Fix: Ensure correct vote count is displayed **
        const voteButton = tempDiv.querySelector(".replyVoteButton");
        if (voteButton) {
            const replyId = reply.ID;
            const voteCounter = voteButton.querySelector(".replyVoteCounter");
        }

        await initializeReplyVotes();
    }

    //===== RENDER REPLY FUNCTION =====//

    async function fetchReplyVotes() {
        const query = `
          query calcMemberCommentUpvotesForumCommentUpvotesMany {
            calcMemberCommentUpvotesForumCommentUpvotesMany {
              ID: field(arg: ["id"])
              Forum_Comment_Upvote_ID: field(arg: ["forum_comment_upvote_id"])
              Member_Comment_Upvote_ID: field(arg: ["member_comment_upvote_id"])
            }
          }
        `;
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            return data?.data?.calcMemberCommentUpvotesForumCommentUpvotesMany || [];
        } catch (error) {
            return [];
        }
    }

    // ---------- INITIALIZE REPLY VOTES -----------
    async function initializeReplyVotes() {
        const votes = await fetchReplyVotes();
        replyUserVotesMap = {};
        const uniqueVotes = {};

        votes.forEach((vote) => {
            const replyId = vote.Forum_Comment_Upvote_ID;
            if (!uniqueVotes[replyId]) {
                uniqueVotes[replyId] = new Set();
            }
            uniqueVotes[replyId].add(vote.Member_Comment_Upvote_ID);

            // Store user's own votes
            if (
                parseInt(vote.Member_Comment_Upvote_ID) === parseInt(LOGGED_IN_USER_ID)
            ) {
                if (!replyUserVotesMap[replyId]) {
                    replyUserVotesMap[replyId] = [];
                }
                replyUserVotesMap[replyId].push(vote.ID);
            }
        });

        // Convert unique votes to count
        window.replyVoteCountMap = {};
        for (const replyId in uniqueVotes) {
            window.replyVoteCountMap[replyId] = uniqueVotes[replyId].size;
        }

        // ** Fix: Ensure vote counts are displayed on replies **
        document.querySelectorAll(".replyVoteButton").forEach((button) => {
            const replyId = button.id.replace("vote-", "");
            const voteCounter = button.querySelector(".replyVoteCounter");
            if (voteCounter) {
                voteCounter.textContent = window.replyVoteCountMap[replyId] || 0;
            }
            if (replyUserVotesMap[replyId] && replyUserVotesMap[replyId].length > 0) {
                button.classList.add("voted");
            }
        });
    }

    document.addEventListener("click", async (e) => {
        const replyVoteBtn = e.target.closest(".replyVoteButton");
        if (!replyVoteBtn) return;

        // Extract reply ID
        const replyId = String(replyVoteBtn.id.replace("vote-", ""));
        const replyVoteCountElem = replyVoteBtn.querySelector(".replyVoteCounter");

        // Disable UI while processing
        replyVoteBtn.style.opacity = "50%";
        replyVoteBtn.style.pointerEvents = "none";

        try {
            if (replyUserVotesMap[replyId] && replyUserVotesMap[replyId].length > 0) {
                // User has already voted, so remove the vote
                const deletePromises = replyUserVotesMap[replyId].map((voteId) => {
                    const mutation = `
                          mutation deleteMemberCommentUpvotesForumCommentUpvotes($id: AwcMemberCommentUpvotesForumCommentUpvotesID) {
                              deleteMemberCommentUpvotesForumCommentUpvotes(query: [{ where: { id: $id } }]) { id }
                          }
                      `;
                    return fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                        body: JSON.stringify({
                            query: mutation,
                            variables: { id: voteId },
                        }),
                    }).then((res) => res.json());
                });

                await Promise.all(deletePromises);

                // Update vote count
                window.replyVoteCountMap[replyId] = Math.max(
                    (window.replyVoteCountMap[replyId] || 1) - 1,
                    0
                );
                replyVoteCountElem.textContent = window.replyVoteCountMap[replyId];

                replyVoteBtn.classList.remove("voted");
                delete replyUserVotesMap[replyId];
            } else {
                // User has not voted, so add a vote
                const mutation = `
                      mutation createMemberCommentUpvotesForumCommentUpvotes($payload: MemberCommentUpvotesForumCommentUpvotesCreateInput = null) {
                          createMemberCommentUpvotesForumCommentUpvotes(payload: $payload) {
                              ID: id
                              forum_comment_upvote_id
                              member_comment_upvote_id
                          }
                      }
                  `;
                const payload = {
                    forum_comment_upvote_id: replyId,
                    member_comment_upvote_id: LOGGED_IN_USER_ID,
                };

                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                    body: JSON.stringify({ query: mutation, variables: { payload } }),
                });

                const result = await response.json();
                if (result.data?.createMemberCommentUpvotesForumCommentUpvotes) {
                    // Store the vote
                    replyUserVotesMap[replyId] = [
                        result.data.createMemberCommentUpvotesForumCommentUpvotes.ID,
                    ];

                    // Update the vote count
                    window.replyVoteCountMap[replyId] =
                        (window.replyVoteCountMap[replyId] || 0) + 1;
                    replyVoteCountElem.textContent = window.replyVoteCountMap[replyId];

                    replyVoteBtn.classList.add("voted");
                }
            }
        } catch (error) {
        } finally {
            replyVoteBtn.style.opacity = "100%";
            replyVoteBtn.style.pointerEvents = "";
        }
    });

    //===== EVENT LISTENER FOR SUBMITTING REPLIES =====//
    document.addEventListener("submit", async (e) => {
        if (!e.target.classList.contains("replyForm")) return;
        e.preventDefault();

        const form = e.target;
        const replyInput = form.querySelector(".replyContent");
        const comment = replyInput.innerHTML.trim();
        const allMentionsPayload = gatherMentionsFromElementt(replyInput);
        if (!comment) return;

        const announcementID = form.closest("[data-announcement-template-id]").getAttribute("data-announcement-template-id");
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;
        replyInput.disabled = true;
        form.style.opacity = "50%";
        form.style.pointerEvents = "none";

        const tempReply = {
            ID: `temp_${Date.now()}`,
            Author_First_Name: LOGGED_IN_USER_FIRST_NAME,
             Author_Display_Name: LOGGED_IN_USER_Display_NAME,
            Author_Last_Name: LOGGED_IN_USER_LAST_NAME,
            Author_Profile_Image: formatProfileImage(LOGGED_IN_USER_IMAGE),
            Comment: comment,
            Date_Added: "Just now",
            isOwner: true,
        };
        renderReply(announcementID, tempReply);

        try {
            const createdReply = await createReplyAnnouncement(announcementID, comment, allMentionsPayload);
            if (createdReply) {
                const replies = await fetchRepliesForAnnouncement(announcementID);
                const announcementEl = document.querySelector(
                    `[data-announcement-template-id="${announcementID}"]`
                );
                let repliesContainer =
                    announcementEl.querySelector(".repliesContainer");

                if (!repliesContainer) {
                    repliesContainer = document.createElement("div");
                    repliesContainer.className =
                        "repliesContainer w-full flex flex-col gap-4";
                    announcementEl.prepend(repliesContainer);
                }

                repliesContainer.innerHTML = "";
                replies.forEach((reply) => {
                    reply.Date_Added = formatDateTimeFromUnix(reply.Date_Added);
                    reply.Author_Profile_Image = formatProfileImage(
                        reply.Author_Profile_Image
                    );
                    reply.isOwner = String(reply.Author_ID) === String(LOGGED_IN_USER_ID);
                    renderReply(announcementID, reply);
                });
            }
        } catch (error) {
        } finally {
            submitButton.disabled = false;
            replyInput.disabled = false;
            replyInput.innerHTML = "";
            form.style.opacity = "100%";
            form.style.pointerEvents = "";
        }
    });

    async function deleteReply(replyID) {
        const query = `
              mutation deleteForumComment($id: AwcForumCommentID) {
                  deleteForumComment(query: [{ where: { id: $id } }]) {
                      id
                  }
              }
          `;

        const replyEl = document.querySelector(`[data-reply-id="${replyID}"]`);
        if (replyEl) replyEl.style.opacity = "0.6";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Api-Key": apiKey },
                body: JSON.stringify({ query, variables: { id: replyID } }),
            });
            const result = await response.json();
            if (result.data?.deleteForumComment) {
                replyEl.remove();
            } else {
                replyEl.style.opacity = "1";
            }
        } catch (error) {
            replyEl.style.opacity = "1";
        }
    }

    // Event listener for deleting replies
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".deleteReply")) return;
        const replyID = e.target
            .closest("[data-reply-id]")
            .getAttribute("data-reply-id");
        deleteReply(replyID);
    });

   
