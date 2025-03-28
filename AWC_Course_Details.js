 const overviewElements = document.querySelectorAll('.overview');
  overviewElements.forEach((overviewElement) => {
    overviewElement.setAttribute('x-show', "selectedTab === 'overview'");
    overviewElement.setAttribute('id', 'tabpanelOverview');
    overviewElement.setAttribute('role', 'tabpanel');
    overviewElement.setAttribute('aria-label', 'overview');
  });
     const announcemnetElements = document.querySelectorAll('.anouncemnt');
  announcemnetElements.forEach((anouncemntElement) => {
    anouncemntElement.setAttribute('x-show', "selectedTab === 'anouncemnt'");
    anouncemntElement.setAttribute('id', 'tabpanelanouncemnt');
    anouncemntElement.setAttribute('role', 'tabpanel');
    anouncemntElement.setAttribute('aria-label', 'anouncemnt');
  });
  const courseChatElements = document.querySelectorAll('.courseChat');
  courseChatElements.forEach((courseChatElement) => {
    courseChatElement.setAttribute('x-show', "selectedTab === 'courseChat'");
    courseChatElement.setAttribute('id', 'tabpanelCourseChat');
    courseChatElement.setAttribute('role', 'tabpanel');
    courseChatElement.setAttribute('aria-label', 'courseChat');
  });

  const contentElements = document.querySelectorAll('.content');
  contentElements.forEach((contentElement) => {
    contentElement.setAttribute('x-show', "selectedTab === 'content'");
    contentElement.setAttribute('id', 'tabpanelContent');
    contentElement.setAttribute('role', 'tabpanel');
    contentElement.setAttribute('aria-label', 'content');
  });

  const progressElements = document.querySelectorAll('.courseProgress');
  progressElements.forEach((progressElement) => {
    progressElement.setAttribute('x-show', "selectedTab === 'progress'");
    progressElement.setAttribute('id', 'tabpanelProgress');
    progressElement.setAttribute('role', 'tabpanel');
    progressElement.setAttribute('aria-label', 'progress');
  });

  // Set attributes for nested tabs (allPosts, myPosts, announcements) that only work inside courseChat
  const allPostsElements = document.querySelectorAll('.allPosts');
  allPostsElements.forEach((allPostsElement) => {
    allPostsElement.setAttribute('x-show', "selectedTab === 'courseChat' && postTabs === 'allPosts'");
    allPostsElement.setAttribute('id', 'tabpanelAllPosts');
    allPostsElement.setAttribute('role', 'tabpanel');
    allPostsElement.setAttribute('aria-label', 'all posts');
  });

  const myPostsElements = document.querySelectorAll('.myPosts');
  myPostsElements.forEach((myPostsElement) => {
    myPostsElement.setAttribute('x-show', "selectedTab === 'courseChat' && postTabs === 'myPosts'");
    myPostsElement.setAttribute('id', 'tabpanelMyPosts');
    myPostsElement.setAttribute('role', 'tabpanel');
    myPostsElement.setAttribute('aria-label', 'my posts');
  });

  const announcementsElements = document.querySelectorAll('.announcements');
  announcementsElements.forEach((announcementsElement) => {
    announcementsElement.setAttribute('x-show', "selectedTab === 'courseChat' && postTabs === 'announcements'");
    announcementsElement.setAttribute('id', 'tabpanelAnnouncements');
    announcementsElement.setAttribute('role', 'tabpanel');
    announcementsElement.setAttribute('aria-label', 'announcements');
  });

const API_KEY = "mMzQezxyIwbtSc85rFPs3";
const GRAPHQL_ENDPOINT = "https://awc.vitalstats.app/api/v1/graphql";
async function fetchGraphQL(query) {
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        return result?.data || {};
    } catch (error) {
       
        return {};
    }
}
function formatDate(unixTimestamp) {
    if (!unixTimestamp) return "Invalid Date";
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
}
async function fetchModuleCustomisation(moduleID) {
    const customisationQuery = `
        query {
            calcClassCustomisations(
                query: [{ where: { module_to_modify_id: ${moduleID} } }]
                limit: 1
                offset: 0
                orderBy: [{ path: ["created_at"], type: desc }]
            ) {
                ID: field(arg: ["id"])
                Date_Added: field(arg: ["created_at"])
                Days_to_Offset: field(arg: ["days_to_offset"])
                Specific_Date: field(arg: ["specific_date"])
            }
        }
    `;
    const response = await fetchGraphQL(customisationQuery);
    const customisation = response?.calcClassCustomisations?.[0] || null;    
    return customisation;
}
async function fetchLessonCustomisation(lessonID) {
    const customisationQuery = `
        query {
            calcClassCustomisations(
                query: [
                    { where: { lesson_to_modify_id: ${lessonID} } }
                    {
                        andWhere: {
                            Lesson_to_Modify: [
                                { where: { type: "Assessment" } }
                            ]
                        }
                    }
                ]
                limit: 1
                offset: 0
                orderBy: [{ path: ["created_at"], type: desc }]
            ) {
                ID: field(arg: ["id"])
                Date_Added: field(arg: ["created_at"])
                Days_to_Offset: field(arg: ["days_to_offset"])
                Specific_Date: field(arg: ["specific_date"])
            }
        }
    `;
    const response = await fetchGraphQL(customisationQuery);
    const customisation = response?.calcClassCustomisations?.[0] || null;   
    return customisation;
}
function getUpcomingSunday(startDateUnix, weeksOffset = 0) {
    const startDate = new Date(startDateUnix * 1000);
    let nextSunday = new Date(startDate);
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()) + (weeksOffset * 7));
    return Math.floor(nextSunday.getTime() / 1000);
}
async function determineAssessmentDueDate(lesson, moduleStartDateUnix) {
    const lessonID = lesson.ID;
    const dueWeek = lesson.Assessment_Due_End_of_Week;
    const customisation = await fetchLessonCustomisation(lessonID);
    let dueDateUnix;
    let dueDateText;
    if (customisation) {
        if (customisation.Specific_Date) {
            dueDateUnix = customisation.Specific_Date > 9999999999
                ? Math.floor(customisation.Specific_Date / 1000)
                : customisation.Specific_Date;
            dueDateText = `Due on ${formatDate(dueDateUnix)}`;
        } else if (customisation.Days_to_Offset !== null) {
            if (customisation.Days_to_Offset === 0) {
                dueDateUnix = moduleStartDateUnix;
            } else if (customisation.Days_to_Offset === -1) {
                dueDateUnix = getUpcomingSunday(moduleStartDateUnix, 0) - (24 * 60 * 60);
            } else if (customisation.Days_to_Offset === 1) {
                dueDateUnix = getUpcomingSunday(moduleStartDateUnix, 1) + (24 * 60 * 60);
            } else {
                dueDateUnix = getUpcomingSunday(moduleStartDateUnix, customisation.Days_to_Offset);
            }
            dueDateText = `Due on ${formatDate(dueDateUnix)}`;          
        } else {
         dueDateUnix = getUpcomingSunday(moduleStartDateUnix, dueWeek);
            dueDateText = `Due on ${formatDate(dueDateUnix)}`;
        }
    } else { 
        if (dueWeek === 0) {
            dueDateUnix = moduleStartDateUnix;
        } else {
            dueDateUnix = getUpcomingSunday(moduleStartDateUnix, dueWeek);
        }

        dueDateText = `Due on ${formatDate(dueDateUnix)}`;
    }
    return { dueDateUnix, dueDateText };
}
function determineAvailability(startDateUnix, weeks, customisation) {
    if (!startDateUnix) {
        return { isAvailable: false, openDateText: "No Start Date" };
    }
    let openDateUnix;
    let openDateText;

    if (!customisation) {
        openDateUnix = startDateUnix + (weeks * 7 * 24 * 60 * 60);
        openDateText = `Unlocks on ${formatDate(openDateUnix)}`;
   
    } else {
        if (customisation.Specific_Date) {
            openDateUnix = customisation.Specific_Date > 9999999999 
                ? Math.floor(customisation.Specific_Date / 1000)  
                : customisation.Specific_Date;  
            openDateText = `Unlocks on ${formatDate(openDateUnix)}`;
        } else if (customisation.Days_to_Offset !== null) {
            openDateUnix = startDateUnix + (customisation.Days_to_Offset * 24 * 60 * 60);
            openDateText = `Unlocks on ${formatDate(openDateUnix)}`;
        } else {
            openDateUnix = startDateUnix + (weeks * 7 * 24 * 60 * 60);
            openDateText = `Unlocks on ${formatDate(openDateUnix)}`;
        }
    }
    const todayUnix = Math.floor(Date.now() / 1000);
    const isAvailable = openDateUnix >= todayUnix;
    return { isAvailable, openDateText };
}
async function fetchLessonStatuses() {
    const completedLessons = await fetchGraphQL(completedQuery);
    const inProgressLessons = await fetchGraphQL(inProgressQuery);
    const completedSet = new Set(
        completedLessons?.calcOEnrolmentLessonCompletionLessonCompletions?.map(lesson => Number(lesson.Lesson_Completion_ID)) || []
    );
    const inProgressSet = new Set(
        inProgressLessons?.calcOLessonInProgressLessonEnrolmentinProgresses?.map(lesson => Number(lesson.Lesson_In_Progress_ID)) || []
    );
    return { completedSet, inProgressSet };
}
async function combineModulesAndLessons() {
    const modulesResponse = await fetchGraphQL(getModulesQuery);
    const lessonsResponse = await fetchGraphQL(getLessonsQuery);
    const lessonStatuses = await fetchLessonStatuses(studentID);
    const modules = modulesResponse?.calcModules || [];
    const lessonsData = lessonsResponse?.calcLessons || [];
    if (!Array.isArray(modules) || !Array.isArray(lessonsData)) { 
        return [];
    }
    const modulesMap = {};
    for (const module of modules) {
        const customisation = await fetchModuleCustomisation(module.ID);
        const { isAvailable, openDateText } = determineAvailability(
            module.Class_Start_Date,
            module.Week_Open_from_Start_Date,
            customisation
        );
        modulesMap[module.ID] = {
            ...module,
            Lessons: [],
            Open_Date_Text: openDateText,
            isAvailable: isAvailable,
        };
    }
    const uniqueLessonsSet = new Set();
    const assessmentPromises = [];
    for (const lesson of lessonsData) {
        let moduleId = lesson.Module_ID;
        if (modulesMap[moduleId] && lesson.Lesson_Name && !uniqueLessonsSet.has(lesson.ID)) {
            uniqueLessonsSet.add(lesson.ID);
            let status = "NotStarted";
            const lessonID = lesson.ID;
            if (lessonStatuses.completedSet.has(lessonID)) {
                status = "Completed";
            } else if (lessonStatuses.inProgressSet.has(lessonID)) {
                status = "InProgress";
            }
            let dueDateInfo = { dueDateUnix: null, dueDateText: "No Due Date" };
            if (lesson.Type === "Assessment") {
                dueDateInfo = await determineAssessmentDueDate(lesson, modulesMap[moduleId].Class_Start_Date);
            }
            modulesMap[moduleId].Lessons.push({
                ...lesson,
                Lessons_Unique_ID:lesson.Unique_ID,
                Lessons_Lesson_Name: lesson.Lesson_Name,
                Lesson_AWC_Lesson_Content_Page_URL: lesson.AWC_Lesson_Content_Page_URL,
                Lessons_Lesson_Length_in_Hour: lesson.Lesson_Length_in_Hour,
                Lessons_Lesson_Length_in_Minute: lesson.Lesson_Length_in_Minute,
                Lessons_Lesson_Length_in_Second: lesson.Lesson_Length_in_Second,
                Lessons_Lesson_Introduction_Text: lesson.Lesson_Introduction_Text,
                Lessons_Lesson_Learning_Outcome: lesson.Lesson_Learning_Outcome,
                LessonsID: lesson.ID,
                LessonsType: lesson.Type,
                Due_Date_Text: dueDateInfo.dueDateText,
                Status: status, 
                Lessons_Your_Next_Step: lesson.Your_Next_Step,
                Custom_Button_Text: lesson.Custom_Button_Text,
                Lessons_Join_Your_New_Community: lesson.Join_Your_New_Community,
                Lessons_Give_Us_Your_Feedback: lesson.Give_Us_Your_Feedback,
                Lessons_Download_Your_Certificate: lesson.Download_Your_Certificate,
                Enrolment_Student_ID: lesson.Enrolment_Student_ID,

                // Module-level Information
                Module_Name: modulesMap[moduleId].Module_Name,
                Enrolment_Date_Completion: modulesMap[moduleId].Enrolment_Date_Completion,
                Enrolment_Certificate_Link: modulesMap[moduleId].Enrolment_Certificate_Link,
                EnrolmentID: modulesMap[moduleId].EnrolmentID, 
                Don_t_Track_Progress: modulesMap[moduleId].Don_t_Track_Progress, 
                Course_Course_Access_Type: modulesMap[moduleId].Course_Course_Access_Type, 
                Module_Description: modulesMap[moduleId].Description, 
                Open_Date_Text: modulesMap[moduleId].Open_Date_Text, 
                isAvailable: modulesMap[moduleId].isAvailable, 
                Week_Open_from_Start_Date: modulesMap[moduleId].Week_Open_from_Start_Date, 
            });
        }
    }
    await Promise.all(assessmentPromises);
    let sortedModules = Object.values(modulesMap);
    sortedModules.sort((a, b) => a.Order - b.Order);
    return sortedModules;
}
async function renderModules() {
    const skeletonHTML = `
        <div class="skeleton-container">
            <div class="skeleton-card skeleton-shimmer"></div>
            <div class="skeleton-card skeleton-shimmer"></div>
            <div class="skeleton-card skeleton-shimmer"></div>
            <div class="skeleton-card skeleton-shimmer"></div>
            <div class="skeleton-card skeleton-shimmer"></div>
        </div>
    `;
    $("#modulesContainer").html(skeletonHTML);
    $("#progressModulesContainer").html(skeletonHTML);
    const modules = await combineModulesAndLessons();
    if (!Array.isArray(modules)) {
        return;
    }
    const template = $.templates("#modulesTemplate");
    const htmlOutput = template.render({ modules });
    const progressTemplate = $.templates("#progressModulesTemplate");
    const progressOutput = progressTemplate.render({ modules });
    $("#modulesContainer").html(htmlOutput);
    $("#progressModulesContainer").html(progressOutput);
}
function addEventListenerIfExists(id, event, handler) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, async () => {
            await handler(); 
        });
    }
}
addEventListenerIfExists("fetchModulesLessons", "click", renderModules);
addEventListenerIfExists("fetchProgressModulesLessons", "click", renderModules);
addEventListenerIfExists("finalMessageButton", "click", renderModules);
