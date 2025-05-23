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
    return response?.calcClassCustomisations?.[0] || null;
}

async function fetchLessonCustomisation(lessonID) {
    const customisationQuery = `
        query {
            calcClassCustomisations(
                query: [{ where: { lesson_to_modify_id: ${lessonID} } }]
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
    return response?.calcClassCustomisations?.[0] || null;
}

function getUpcomingSunday(startDateUnix, weeksOffset = 0) {
    const startDate = new Date(startDateUnix * 1000);
    let nextSunday = new Date(startDate);
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()) + (weeksOffset * 7));
    return Math.floor(nextSunday.getTime() / 1000);
}

async function determineAssessmentDueDate(lesson, moduleStartDateUnix) {
    const lessonID = lesson.LessonsID;
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
        dueDateUnix = dueWeek === 0 ? moduleStartDateUnix : getUpcomingSunday(moduleStartDateUnix, dueWeek);
        dueDateText = `Due on ${formatDate(dueDateUnix)}`;
    }
    
    return { dueDateUnix, dueDateText };
}

async function combineModulesAndLessons() {
    const modulesResponse = await fetchGraphQL(getModulesQuery);
    const lessonsResponse = await fetchGraphQL(getLessonsQuery);

    const modules = modulesResponse?.calcModules || [];
    const lessonsData = lessonsResponse?.calcLessons || [];

    if (!Array.isArray(modules) || !Array.isArray(lessonsData)) {
        
        return [];
    }
    const modulesMap = {};
    for (const module of modules) {
        modulesMap[module.ID] = {
            ...module,
            Lessons: []
        };
    }
    const uniqueLessonsSet = new Set();
    for (const lesson of lessonsData) {
        let moduleId = lesson.Module_ID;

        if (modulesMap[moduleId] && lesson.Lesson_Name && !uniqueLessonsSet.has(lesson.ID)) {
            uniqueLessonsSet.add(lesson.ID);

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
                Lessons_Your_Next_Step: lesson.Your_Next_Step, 
                Lessons_Join_Your_New_Community: lesson.Join_Your_New_Community, 
                Lessons_Give_Us_Your_Feedback: lesson.Give_Us_Your_Feedback, 
                Lessons_Download_Your_Certificate: lesson.Download_Your_Certificate, 
                Enrolment_Student_ID: lesson.Enrolment_Student_ID, 

                Module_Name: modulesMap[moduleId].Module_Name, 
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


document.addEventListener("DOMContentLoaded", async () => {
    await renderModules();
});
