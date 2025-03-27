
    function convertToElapsedTime(timestamp) {
        if (typeof timestamp === "string" && isNaN(timestamp)) {
            let date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return "Just Now";
            }
            timestamp = date.getTime();
        }

        let numericTimestamp = typeof timestamp === "number" ? timestamp : parseInt(String(timestamp).replace(/\D/g, ''), 10);

        if (isNaN(numericTimestamp)) {
            return "Just Now ";
        }

        if (numericTimestamp < 1e12) { numericTimestamp *= 1000; } const now = Date.now(); const timeDifference = now -
            numericTimestamp; if (timeDifference < 0) { return "Just Now"; } const seconds = Math.floor(timeDifference / 1000);
        if (seconds < 30) { return "just now"; } if (seconds < 60) { return `${seconds} secs ago`; } const
            minutes = Math.floor(seconds / 60); if (minutes === 1) { return "1 minute ago"; } if (minutes < 60) {
                return
                `${minutes} mins ago`;
            } const hours = Math.floor(minutes / 60); if (hours === 1) { return "1 hr ago"; } if (hours <
                24) { return `${hours} hrs ago`; } const days = Math.floor(hours / 24); if (days === 1) { return "1 day ago"; } if
            (days < 14) { return `${days} days ago`; } if (days < 30) { return "1 fortnight ago"; } const
                months = Math.floor(days / 30); if (months === 1) { return "1 mnth ago"; } if (months < 12) {
                    return `${months} mts
    ago`;
                } const years = Math.floor(months / 12); if (years === 1) { return "Posted 1 yr ago"; } return `${years} yrs
    ago`;
    } function templateForForumPost(profileImg, authorFullName, date, postCopy, authorID, actualPostID, postFile,
        isAuthorAnInstructor, ForumCommentsTotalCount, isAuthorAnAdmin) {
            const numericPostID = parseInt(actualPostID, 10);
        const hasRealID = !Number.isNaN(numericPostID) && numericPostID > 0;

        let objectFromPostFile, fileStringPreview;
        let formattedDate = convertToElapsedTime(date);

        let isShowTripleDot = authorID == visitorContactID;
        let showCommentsCount = ForumCommentsTotalCount > 0;

        if (postFile) {
            objectFromPostFile = analyzeFile(postFile);
            fileStringPreview = generateFilePreview(objectFromPostFile);
        }
        return `
    <div author-ID="${authorID}" current-post-ID="${actualPostID}" x-data="{
showComments: ${hasRealID ? true : false},
isShowTripleDot: ${isShowTripleDot},
showCommentsCount: ${showCommentsCount},
init() {
if (${hasRealID}) {
renderCommentsForPost(${numericPostID});
}
}
}" class="bg-[#fff] rounded-[4px] w-full flex flex-col gap-y-3 p-4 forum-post serif border border-[#F2F2F2]">

        <!-- Top row: Profile area & triple-dot menu -->
        <div class="flex justify-between items-center">

            <!-- Left Section: Profile + Name + Roles -->
            <div class="flex items-center gap-x-4 justify-start">
                <img class="w-6 h-6 relative rounded-[50%] border border-[#d3d3d3] max-[600px]:w-[40px] max-[600px]:h-[40px]"
                    src="${(profileImg && profileImg !== 'https://i.ontraport.com/abc.jpg')
                ? profileImg
                : 'https://files.ontraport.com/media/b0456fe87439430680b173369cc54cea.php03bzcx?Expires=4895186056&Signature=fw-mkSjms67rj5eIsiDF9QfHb4EAe29jfz~yn3XT0--8jLdK4OGkxWBZR9YHSh26ZAp5EHj~6g5CUUncgjztHHKU9c9ymvZYfSbPO9JGht~ZJnr2Gwmp6vsvIpYvE1pEywTeoigeyClFm1dHrS7VakQk9uYac4Sw0suU4MpRGYQPFB6w3HUw-eO5TvaOLabtuSlgdyGRie6Ve0R7kzU76uXDvlhhWGMZ7alNCTdS7txSgUOT8oL9pJP832UsasK4~M~Na0ku1oY-8a7GcvvVv6j7yE0V0COB9OP0FbC8z7eSdZ8r7avFK~f9Wl0SEfS6MkPQR2YwWjr55bbJJhZnZA__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA'}"
                    alt="Profile Image" />
                <div class="flex items-center gap-x-4 max-[600px]:flex-col max-[600px]:gap-y-1 max-[600px]:items-start">
                    <div class="justify-start items-center gap-x-4 flex">
                        <div class="text-[#414042] button max-[600px]:tracking-[0.86px]">
                            ${authorFullName}
                        </div>
                        <div class="py-1.5 px-3 ${isAuthorAnInstructor || isAuthorAnAdmin ? " bg-[#ffeaa7]"
                : "bg-[#c7e6e6]"} rounded-[36px] font-400 text-[12px] leading-[12px] text-dark">
                            ${isAuthorAnAdmin
                ? "AWC Admin"
                : isAuthorAnInstructor
                    ? "Tutor"
                    : "Student"
            }
                        </div>
                        <div class="w-[2px] h-[15px] bg-[#bbbcbb] max-[600px]:hidden"></div>
                    </div>
                    <div class="text-[#586a80] small-text">${formattedDate}</div>
                </div>
            </div>

            <!-- Right Section: Triple Dot Menu -->
            <div class="relative" x-show="isShowTripleDot">
                <!-- The dropdown container -->
                <div class="optionsContainerPosts absolute top-full right-0 bg-[#fff] p-3 flex flex-col text-extraSmallText text-dark w-max shadow-[0px_3px_8px_0px_#00000029]
opacity-0 pointer-events-none">

                    <div class="hover:bg-[#ebf6f6] p-2 cursor-pointer edit-post-btn hidden"
                        @click="isEditModalExpanded = !isEditModalExpanded">
                        Edit Post
                    </div>
                    <!-- 'Delete Post' only if the user is the post owner -->
                    <template x-if="isShowTripleDot">
                        <div class="hover:bg-[#ebf6f6] p-2 cursor-pointer delete-post-btn">
                            Delete Post
                        </div>
                    </template>
                </div>
                <!-- Triple Dot SVG -->
                <svg class="tripleDotSVG cursor-pointer" width="4" height="14" viewBox="0 0 4 14" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.45679 7.00001C3.45679 7.34185 3.35542 7.67602 3.1655 7.96026C2.97558 8.24449 2.70565 8.46602 2.38982 8.59684C2.074 8.72766 1.72648 8.76189 1.3912 8.6952C1.05593 8.6285 0.747957 8.46389 0.506236 8.22217C0.264516 7.98045 0.0999019 7.67248 0.0332114 7.3372C-0.0334791 7.00193 0.000748884 6.65441 0.131567 6.33858C0.262385 6.02276 0.483918 5.75282 0.768151 5.5629C1.05238 5.37298 1.38655 5.27162 1.7284 5.27162C2.18679 5.27162 2.62642 5.45371 2.95056 5.77785C3.27469 6.10199 3.45679 6.54161 3.45679 7.00001ZM1.7284 3.79013C2.07024 3.79013 2.40441 3.68877 2.68864 3.49885C2.97287 3.30893 3.19441 3.03899 3.32522 2.72317C3.45604 2.40734 3.49027 2.05982 3.42358 1.72455C3.35689 1.38927 3.19228 1.0813 2.95056 0.839579C2.70884 0.597859 2.40086 0.433245 2.06559 0.366555C1.73031 0.299864 1.38279 0.334092 1.06697 0.464911C0.751145 0.595729 0.481206 0.817261 0.291288 1.10149C0.101369 1.38573 0 1.7199 0 2.06174C0 2.52014 0.182099 2.95976 0.506236 3.2839C0.830373 3.60804 1.27 3.79013 1.7284 3.79013ZM1.7284 10.2099C1.38655 10.2099 1.05238 10.3113 0.768151 10.5012C0.483918 10.6911 0.262385 10.961 0.131567 11.2769C0.000748884 11.5927 -0.0334791 11.9402 0.0332114 12.2755C0.0999019 12.6108 0.264516 12.9187 0.506236 13.1604C0.747957 13.4022 1.05593 13.5668 1.3912 13.6335C1.72648 13.7002 2.074 13.6659 2.38982 13.5351C2.70565 13.4043 2.97558 13.1828 3.1655 12.8985C3.35542 12.6143 3.45679 12.2801 3.45679 11.9383C3.45679 11.4799 3.27469 11.0403 2.95056 10.7161C2.62642 10.392 2.18679 10.2099 1.7284 10.2099Z"
                        fill="#414042"></path>
                </svg>
            </div>
        </div>

        <!-- Post Copy -->
        <div class="text-bodyText text-dark">${postCopy}</div>
        <iframe class="h-[450px] w-full border-none hidden" allowfullscreen></iframe>

        <!-- If there's a file, display its preview -->
        ${postFile ? fileStringPreview || "" : ""}

        <!-- Voting + comment button row -->
        <div class="justify-start items-center gap-4 flex">
            <button class="roundedButton voteButton_chat" id="vote-null">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.3092 5.81653C14.1751 5.66459 14.0103 5.54291 13.8255 5.45958C13.6408 5.37625 13.4405 5.33318 13.2378 5.33322H9.90462V4.38087C9.90462 3.74942 9.65378 3.14384 9.20728 2.69734C8.76079 2.25084 8.1552 2 7.52376 2C7.43529 1.99994 7.34856 2.02452 7.27329 2.07099C7.19801 2.11746 7.13717 2.18397 7.09758 2.26309L4.84885 6.76174H2.28584C2.03327 6.76174 1.79103 6.86207 1.61243 7.04067C1.43383 7.21927 1.3335 7.46151 1.3335 7.71409V12.952C1.3335 13.2046 1.43383 13.4468 1.61243 13.6254C1.79103 13.804 2.03327 13.9043 2.28584 13.9043H12.5236C12.8716 13.9045 13.2077 13.7775 13.4688 13.5474C13.7298 13.3172 13.8979 12.9997 13.9414 12.6544L14.6557 6.9403C14.681 6.73913 14.6632 6.53488 14.6034 6.34112C14.5437 6.14736 14.4434 5.96854 14.3092 5.81653ZM2.28584 7.71409H4.66671V12.952H2.28584V7.71409Z"
                        fill="#007C8F"></path>
                </svg>
                <div class="text-label voteCounter_chat">0</div>
            </button>
            <div id="reply-null" @click="toggleCommentBox('${actualPostID}')"
                class="px-2.5 py-1 rounded-lg justify-center items-center gap-2 flex">
                <div class="text-[#007b8e] text-label cursor-pointer">Comment</div>
            </div>
        </div>

        <!-- Comments count row (only visible if forumCommentsTotalCount>0) -->
        <div class="flex items-center gap-x-3" x-show="showCommentsCount">
            <div class="h-[1px] w-full bg-[#bbbcbb]"></div>
            <div class="label flex items-center gap-x-2 cursor-pointer">
                <span class="label whitespace-nowrap text-[#007c8f]" id="commentCountsForPost-${actualPostID}"
                    x-on:click.stop="
if (${hasRealID}) {
showComments = !showComments;
if (showComments) {
renderCommentsForPost(${numericPostID});
handleCommentCounts($el);
}
} else {
showComments = !showComments;
}
">
                    <!-- *You may dynamically update this 0 to ForumCommentsTotalCount if you want -->
                    ${ForumCommentsTotalCount} Comments
                </span>
                <span x-bind:class="showComments ? 'rotate-180' : 'rotate-0'"
                    class="transition-transform duration-300 inline-block">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.8668 4.27635L6.32157 8.82158C6.27936 8.86383 6.22923 8.89736 6.17405 8.92023C6.11888 8.94311 6.05973 8.95488 6 8.95488C5.94027 8.95488 5.88112 8.94311 5.82594 8.92023C5.77077 8.89736 5.72064 8.86383 5.67842 8.82158L1.1332 4.27635C1.04791 4.19106 1 4.07539 1 3.95478C1 3.83416 1.04791 3.71849 1.1332 3.6332C1.21849 3.54791 1.33416 3.5 1.45478 3.5C1.57539 3.5 1.69106 3.54791 1.77635 3.6332L6 7.85742L10.2236 3.6332C10.2659 3.59097 10.316 3.55747 10.3712 3.53462C10.4264 3.51176 10.4855 3.5 10.5452 3.5C10.6049 3.5 10.6641 3.51176 10.7193 3.53462C10.7744 3.55747 10.8246 3.59097 10.8668 3.6332C10.909 3.67543 10.9425 3.72556 10.9654 3.78074C10.9882 3.83592 11 3.89505 11 3.95478C11 4.0145 10.9882 4.07363 10.9654 4.12881C10.9425 4.18399 10.909 4.23412 10.8668 4.27635Z"
                            fill="#007C8F" />
                    </svg>
                </span>
            </div>
            <div class="h-[1px] w-full bg-[#bbbcbb]"></div>
        </div>

        <!-- Container where comments will be injected -->
        <div id="allCommentsForPostContainer" class="flex flex-col gap-y-2" x-show="showComments">
            <!-- The actual comments get appended by 'renderCommentsForPost' -->
            <div>

            </div>
        </div>

        <!-- The 'Add Comment' box, typically shown after user hits "Comment" or toggles it -->
        <div id="commentBox_${actualPostID}"
            class=" border border-[#bbbcbb] rounded-[4px] bg-[#fff] comment-box hover:border-[#007c8f] active:border-[#007c8f]  duration-300  p-3 flex flex-col gap-y-3 hidden">
            <div class="mentionable comment-editor" contenteditable="true"></div>
            <div previewContainerForFiles class="hidden"> </div>
            <div class=" flex items-center justify-end gap-2">
                <div class="outlineButton text-label flex gap-x-2 items-center cursor-pointer hidden" @click="$el.closest('.comment-box').querySelector('#fileInput').click();
">
                    <span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.91667 4.64897H1.41667C1.30616 4.64897 1.20018 4.60508 1.12204 4.52694C1.0439 4.4488 1 4.34281 1 4.23231V1.73231C0.999935 1.64985 1.02434 1.56923 1.07012 1.50065C1.1159 1.43207 1.18099 1.37861 1.25717 1.34705C1.33335 1.31549 1.41718 1.30723 1.49804 1.32334C1.57891 1.33944 1.65319 1.37918 1.71146 1.43752L2.66667 2.39377C3.58969 1.50296 4.8214 1.00356 6.10417 1.00002H6.13177C7.43806 0.996651 8.69309 1.50806 9.625 2.42345C9.70109 2.5013 9.7437 2.60583 9.7437 2.71469C9.74371 2.82354 9.70111 2.92808 9.62503 3.00593C9.54895 3.08378 9.44542 3.12877 9.33659 3.13126C9.22776 3.13376 9.12228 3.09357 9.04271 3.01929C8.26593 2.25683 7.22022 1.8308 6.13177 1.83335H6.10833C5.04593 1.83636 4.02534 2.24772 3.25781 2.98231L4.21146 3.93752C4.2698 3.99579 4.30953 4.07006 4.32564 4.15093C4.34174 4.2318 4.33349 4.31563 4.30193 4.3918C4.27036 4.46798 4.21691 4.53308 4.14833 4.57886C4.07974 4.62464 3.99912 4.64904 3.91667 4.64897Z"
                                fill="#007C8F"></path>
                        </svg>
                    </span>
                    <span>Replace</span>
                </div>
                <div class="outlineButton text-label flex gap-x-2 items-center cursor-pointer hidden" @click="
const container = $el.closest('.comment-box');
const fileInput = container.querySelector('#fileInput');
fileInput.value = '';
container.querySelector('[previewContainerForFiles]').classList.add('hidden');
container.querySelector('[previewContainerForFiles]').innerHTML = '';
$el.closest('.flex.items-center.justify-end.gap-2').querySelectorAll('.outlineButton.text-label').forEach(btn => btn.classList.add('hidden'));
$el.closest('.flex.items-center.justify-end.gap-2').querySelector('button.outlineButton').classList.remove('hidden');
">
                    <span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.3462 2.53846H8.42308V2.15385C8.42308 1.84783 8.30151 1.55434 8.08512 1.33795C7.86874 1.12157 7.57525 1 7.26923 1H4.96154C4.65552 1 4.36203 1.12157 4.14565 1.33795C3.92926 1.55434 3.80769 1.84783 3.80769 2.15385V2.53846H1.88462C1.78261 2.53846 1.68478 2.57898 1.61265 2.65111C1.54052 2.72324 1.5 2.82107 1.5 2.92308C1.5 3.02508 1.54052 3.12291 1.61265 3.19504C1.68478 3.26717 1.78261 3.30769 1.88462 3.30769H2.26923V10.2308C2.26923 10.4348 2.35027 10.6304 2.49453 10.7747C2.63879 10.919 2.83445 11 3.03846 11H9.19231C9.39632 11 9.59198 10.919 9.73624 10.7747C9.8805 10.6304 9.96154 10.4348 9.96154 10.2308V3.30769H10.3462C10.4482 3.30769 10.546 3.26717 10.6181 3.19504C10.6902 3.12291 10.7308 3.02508 10.7308 2.92308C10.7308 2.82107 10.6902 2.72324 10.6181 2.65111C10.546 2.57898 10.4482 2.53846 10.3462 2.53846ZM4.57692 2.15385C4.57692 2.05184 4.61744 1.95401 4.68957 1.88188C4.7617 1.80975 4.85953 1.76923 4.96154 1.76923H7.26923C7.37124 1.76923 7.46907 1.80975 7.5412 1.88188C7.61332 1.95401 7.65385 2.05184 7.65385 2.15385V2.53846H4.57692V2.15385ZM9.19231 10.2308H3.03846V3.30769H9.19231V10.2308ZM5.34615 5.23077V8.30769C5.34615 8.4097 5.30563 8.50753 5.2335 8.57966C5.16137 8.65179 5.06354 8.69231 4.96154 8.69231C4.85953 8.69231 4.7617 8.65179 4.68957 8.57966C4.61744 8.50753 4.57692 8.4097 4.57692 8.30769V5.23077C4.57692 5.12876 4.61744 5.03093 4.68957 4.95881C4.7617 4.88668 4.85953 4.84615 4.96154 4.84615C5.06354 4.84615 5.16137 4.88668 5.2335 4.95881C5.30563 5.03093 5.34615 5.12876 5.34615 5.23077ZM7.65385 5.23077V8.30769C7.65385 8.4097 7.61332 8.50753 7.5412 8.57966C7.46907 8.65179 7.37124 8.69231 7.26923 8.69231C7.16722 8.69231 7.0694 8.65179 6.99727 8.57966C6.92514 8.50753 6.88462 8.4097 6.88462 8.30769V5.23077C6.88462 5.12876 6.92514 5.03093 6.99727 4.95881C7.0694 4.88668 7.16722 4.84615 7.26923 4.84615C7.37124 4.84615 7.46907 4.88668 7.5412 4.95881C7.61332 5.03093 7.65385 5.12876 7.65385 5.23077Z"
                                fill="#007C8F"></path>
                        </svg>
                    </span>
                    <span>Delete</span>
                </div>

                <button class="outlineButton flex items-center gap-2 relative">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.0385 5.72657C10.0743 5.76228 10.1026 5.80468 10.122 5.85136C10.1413 5.89804 10.1513 5.94807 10.1513 5.9986C10.1513 6.04913 10.1413 6.09916 10.122 6.14584C10.1026 6.19252 10.0743 6.23492 10.0385 6.27063L6.09504 10.2117C5.5902 10.7165 4.90551 11 4.19161 11C3.47771 11 2.79306 10.7163 2.28828 10.2115C1.78351 9.70664 1.49995 9.02195 1.5 8.30805C1.50005 7.59415 1.78369 6.9095 2.28852 6.40472L7.05916 1.56392C7.41958 1.20312 7.90856 1.00027 8.41854 1C8.92851 0.99973 9.41771 1.20206 9.77851 1.56247C10.1393 1.92289 10.3422 2.41187 10.3424 2.92185C10.3427 3.43183 10.1404 3.92102 9.77995 4.28182L5.00835 9.12263C4.79166 9.33933 4.49775 9.46107 4.1913 9.46107C3.88484 9.46107 3.59094 9.33933 3.37425 9.12263C3.15755 8.90593 3.03581 8.61203 3.03581 8.30558C3.03581 7.99912 3.15755 7.70522 3.37425 7.48852L7.37781 3.42151C7.41288 3.3841 7.45508 3.35408 7.50193 3.33322C7.54878 3.31236 7.59932 3.30109 7.65059 3.30005C7.70186 3.29902 7.75282 3.30826 7.80047 3.32721C7.84811 3.34617 7.89149 3.37447 7.92804 3.41044C7.96458 3.44641 7.99357 3.48933 8.01328 3.53667C8.03299 3.58401 8.04304 3.63481 8.04282 3.68609C8.04261 3.73737 8.03213 3.78809 8.01202 3.83526C7.99191 3.88243 7.96257 3.92511 7.92572 3.96077L3.92167 8.0321C3.88582 8.06767 3.85733 8.10995 3.83782 8.15653C3.81831 8.2031 3.80816 8.25307 3.80796 8.30357C3.80776 8.35406 3.81751 8.40411 3.83665 8.45084C3.85579 8.49757 3.88394 8.54008 3.91951 8.57593C3.95507 8.61178 3.99735 8.64027 4.04393 8.65978C4.09051 8.67929 4.14047 8.68944 4.19097 8.68964C4.24147 8.68984 4.29151 8.68009 4.33825 8.66095C4.38498 8.64181 4.42748 8.61365 4.46333 8.57809L9.23445 3.73968C9.45114 3.52343 9.57306 3.22996 9.57338 2.92382C9.57369 2.61768 9.45238 2.32395 9.23613 2.10726C9.01988 1.89056 8.7264 1.76865 8.42026 1.76833C8.11413 1.76801 7.8204 1.88933 7.6037 2.10558L2.83403 6.94446C2.65535 7.12286 2.51355 7.3347 2.41674 7.5679C2.31993 7.80109 2.27 8.05107 2.2698 8.30357C2.2696 8.55606 2.31913 8.80612 2.41557 9.03947C2.51201 9.27282 2.65347 9.48489 2.83187 9.66357C3.01026 9.84225 3.22211 9.98404 3.4553 10.0809C3.6885 10.1777 3.93848 10.2276 4.19097 10.2278C4.44346 10.228 4.69352 10.1785 4.92687 10.082C5.16022 9.98559 5.37229 9.84413 5.55097 9.66573L9.49494 5.72465C9.5673 5.65285 9.6652 5.61272 9.76713 5.61308C9.86906 5.61344 9.96668 5.65426 10.0385 5.72657Z"
                            fill="#007C8F"></path>
                    </svg>
                    <span class="text-label w-max">Attach a File</span>
                    <input id="fileInput" type="file" class="absolute w-full opacity-0 top-0 left-0" @change="
populatePreviewContainer($el);
$el.closest('.comment-box').querySelector('[previewContainerForFiles]').classList.remove('hidden');
$el.closest('.flex.items-center.justify-end.gap-2').querySelectorAll('.outlineButton.text-label').forEach(btn => btn.classList.remove('hidden'));
$el.closest('button').classList.add('hidden');
">
                </button>

                <button class="primaryButton hover:!bg-[#00505C] flex items-center gap-2"
                    x-on:click="showComments = true; handleCommentCounts($el); showCommentsCount = true; uploadCommentWithFile($el);">
                    <span class="text-label text-[#fff] w-max max-[650px]:hidden">
                        Post
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.4282 5.99409C10.4285 6.12138 10.3948 6.24645 10.3306 6.35635C10.2664 6.46625 10.174 6.557 10.0629 6.61922L2.56502 10.9062C2.45742 10.9672 2.33595 10.9995 2.21227 11C2.09832 10.9994 1.98616 10.9715 1.88517 10.9187C1.78417 10.8659 1.69727 10.7898 1.63172 10.6965C1.56617 10.6033 1.52386 10.4958 1.50834 10.3829C1.49282 10.27 1.50453 10.155 1.54249 10.0476L2.74809 6.47767C2.75987 6.44277 2.78216 6.41236 2.8119 6.39062C2.84163 6.36888 2.87736 6.35686 2.9142 6.35622H6.14162C6.19059 6.35633 6.23906 6.34636 6.28402 6.32695C6.32898 6.30754 6.36946 6.27909 6.40296 6.24337C6.43646 6.20765 6.46226 6.16543 6.47875 6.11932C6.49525 6.07321 6.50208 6.0242 6.49884 5.97534C6.49074 5.88348 6.44824 5.79808 6.37985 5.73623C6.31145 5.67438 6.22222 5.64065 6.13002 5.64179H2.91509C2.87772 5.64179 2.84129 5.63008 2.81094 5.60829C2.78058 5.5865 2.75782 5.55574 2.74586 5.52034L1.54026 1.95088C1.49228 1.81406 1.48705 1.66588 1.52529 1.52603C1.56352 1.38617 1.6434 1.26126 1.75432 1.16789C1.86524 1.07451 2.00194 1.01709 2.14626 1.00326C2.29059 0.989426 2.43571 1.01983 2.56234 1.09044L10.0638 5.37209C10.1743 5.43416 10.2662 5.52447 10.3302 5.63377C10.3942 5.74307 10.4281 5.86742 10.4282 5.99409Z"
                            fill="#fff"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    `;
    }

    document.addEventListener("DOMContentLoaded", function () {
        let currentFile = null;

        const fileInput = document.querySelector(".formFileInputForClassChat");
        const previewContainer = document.getElementById("showContainerForAllFiles");
        const replaceBtn = document.getElementById("replaceFileContainer");
        const deleteBtn = document.getElementById("deleteFileContainer");
        const attachFileContainer = document.querySelector(".attachAFileForClassChat");

        previewContainer.classList.add("hidden");
        replaceBtn.classList.add("hidden");
        deleteBtn.classList.add("hidden");

        function resetFileSelection() {
            fileInput.value = "";
            previewContainer.innerHTML = "";
            previewContainer.classList.add("hidden");
            replaceBtn.classList.add("hidden");
            deleteBtn.classList.add("hidden");
            attachFileContainer.classList.remove("hidden");
            currentFile = undefined;

        }

        fileInput.addEventListener("change", function () {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                currentFile = file;

                previewContainer.classList.remove("hidden");
                replaceBtn.classList.remove("hidden");
                deleteBtn.classList.remove("hidden");
                attachFileContainer.classList.add("hidden");

                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = document.createElement("img");
                        img.src = e.target.result;
                        img.classList.add("object-cover", "max-h-full", "max-w-full", "w-full", "h-[450px]");
                        previewContainer.innerHTML = "";
                        previewContainer.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }

                else if (file.type.startsWith("audio/")) {
                    const audioURL = URL.createObjectURL(file);
                    const audioPlayerHTML = `
    <div class="flex flex-col gap-y-4  p-4 bg-[#ebf6f6]" x-init="initPlayer()" x-data="audioPlayer();">
        <div class=" flex items-center justify-between">
            <div class="flex items-center gap-x-2" @click="muteUnmuteSound()">
                <svg x-bind:class="volume==0?'hidden':'block'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.7689 16.9995C14.7681 17.678 14.5903 18.3445 14.253 18.9332C13.9158 19.5219 13.4308 20.0124 12.8459 20.3562C12.6707 20.4434 12.4689 20.4606 12.2816 20.4042C12.0942 20.3479 11.9354 20.2223 11.8373 20.053C11.7393 19.8836 11.7095 19.6833 11.754 19.4928C11.7984 19.3022 11.9138 19.1358 12.0767 19.0274C12.4293 18.8192 12.7216 18.5227 12.9246 18.1671C13.1277 17.8115 13.2345 17.409 13.2345 16.9995C13.2345 16.59 13.1277 16.1876 12.9246 15.832C12.7216 15.4764 12.4293 15.1799 12.0767 14.9717C11.9138 14.8633 11.7984 14.6968 11.754 14.5063C11.7095 14.3158 11.7393 14.1155 11.8373 13.9461C11.9354 13.7768 12.0942 13.6512 12.2816 13.5949C12.4689 13.5385 12.6707 13.5557 12.8459 13.6429C13.4308 13.9867 13.9158 14.4772 14.253 15.0659C14.5903 15.6546 14.7681 16.3211 14.7689 16.9995ZM9.67867 12.0583C9.53814 12 9.38347 11.9847 9.23422 12.0143C9.08498 12.0439 8.94787 12.1171 8.84024 12.2247L6.75857 14.3073H4.76921C4.5652 14.3073 4.36955 14.3884 4.2253 14.5326C4.08104 14.6769 4 14.8725 4 15.0765V18.9226C4 19.1266 4.08104 19.3222 4.2253 19.4665C4.36955 19.6107 4.5652 19.6918 4.76921 19.6918H6.75857L8.84024 21.7744C8.94782 21.8821 9.08493 21.9555 9.23422 21.9852C9.38351 22.0149 9.53827 21.9997 9.6789 21.9414C9.81953 21.8831 9.9397 21.7845 10.0242 21.6579C10.1087 21.5312 10.1538 21.3824 10.1537 21.2302V12.7689C10.1536 12.6168 10.1085 12.4681 10.0239 12.3416C9.93939 12.2151 9.81924 12.1165 9.67867 12.0583ZM20.9226 8.15366V20.461C20.9226 20.869 20.7605 21.2603 20.472 21.5488C20.1835 21.8373 19.7922 21.9994 19.3841 21.9994H16.3073C16.1033 21.9994 15.9077 21.9184 15.7634 21.7741C15.6192 21.6298 15.5381 21.4342 15.5381 21.2302C15.5381 21.0262 15.6192 20.8305 15.7634 20.6863C15.9077 20.542 16.1033 20.461 16.3073 20.461H19.3841V8.92287H14.7689C14.5649 8.92287 14.3692 8.84183 14.225 8.69757C14.0807 8.55332 13.9997 8.35767 13.9997 8.15366V3.53842H5.53841V11.2305C5.53841 11.4345 5.45737 11.6301 5.31312 11.7744C5.16886 11.9187 4.97321 11.9997 4.76921 11.9997C4.5652 11.9997 4.36955 11.9187 4.2253 11.7744C4.08104 11.6301 4 11.4345 4 11.2305V3.53842C4 3.1304 4.16208 2.7391 4.45059 2.45059C4.7391 2.16208 5.1304 2 5.53841 2H14.7689C14.8699 1.99992 14.97 2.01975 15.0634 2.05836C15.1568 2.09696 15.2416 2.15358 15.3131 2.22499L20.6976 7.60945C20.769 7.68093 20.8256 7.76579 20.8642 7.85917C20.9028 7.95255 20.9226 8.05262 20.9226 8.15366ZM15.5381 7.38445H18.2967L15.5381 4.62588V7.38445Z"
                        fill="#007C8F" />
                </svg>
                <svg x-bind:class="volume==0?'block':'hidden'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.7689 16.9995C14.7681 17.678 14.5903 18.3445 14.253 18.9332C13.9158 19.5219 13.4308 20.0124 12.8459 20.3562C12.6707 20.4434 12.4689 20.4606 12.2816 20.4042C12.0942 20.3479 11.9354 20.2223 11.8373 20.053C11.7393 19.8836 11.7095 19.6833 11.754 19.4928C11.7984 19.3022 11.9138 19.1358 12.0767 19.0274C12.4293 18.8192 12.7216 18.5227 12.9246 18.1671C13.1277 17.8115 13.2345 17.409 13.2345 16.9995C13.2345 16.59 13.1277 16.1876 12.9246 15.832C12.7216 15.4764 12.4293 15.1799 12.0767 14.9717C11.9138 14.8633 11.7984 14.6968 11.754 14.5063C11.7095 14.3158 11.7393 14.1155 11.8373 13.9461C11.9354 13.7768 12.0942 13.6512 12.2816 13.5949C12.4689 13.5385 12.6707 13.5557 12.8459 13.6429C13.4308 13.9867 13.9158 14.4772 14.253 15.0659C14.5903 15.6546 14.7681 16.3211 14.7689 16.9995ZM9.67867 12.0583C9.53814 12 9.38347 11.9847 9.23422 12.0143C9.08498 12.0439 8.94787 12.1171 8.84024 12.2247L6.75857 14.3073H4.76921C4.5652 14.3073 4.36955 14.3884 4.2253 14.5326C4.08104 14.6769 4 14.8725 4 15.0765V18.9226C4 19.1266 4.08104 19.3222 4.2253 19.4665C4.36955 19.6107 4.5652 19.6918 4.76921 19.6918H6.75857L8.84024 21.7744C8.94782 21.8821 9.08493 21.9555 9.23422 21.9852C9.38351 22.0149 9.53827 21.9997 9.6789 21.9414C9.81953 21.8831 9.9397 21.7845 10.0242 21.6579C10.1087 21.5312 10.1538 21.3824 10.1537 21.2302V12.7689C10.1536 12.6168 10.1085 12.4681 10.0239 12.3416C9.93939 12.2151 9.81924 12.1165 9.67867 12.0583ZM20.9226 8.15366V20.461C20.9226 20.869 20.7605 21.2603 20.472 21.5488C20.1835 21.8373 19.7922 21.9994 19.3841 21.9994H16.3073C16.1033 21.9994 15.9077 21.9184 15.7634 21.7741C15.6192 21.6298 15.5381 21.4342 15.5381 21.2302C15.5381 21.0262 15.6192 20.8305 15.7634 20.6863C15.9077 20.542 16.1033 20.461 16.3073 20.461H19.3841V8.92287H14.7689C14.5649 8.92287 14.3692 8.84183 14.225 8.69757C14.0807 8.55332 13.9997 8.35767 13.9997 8.15366V3.53842H5.53841V11.2305C5.53841 11.4345 5.45737 11.6301 5.31312 11.7744C5.16886 11.9187 4.97321 11.9997 4.76921 11.9997C4.5652 11.9997 4.36955 11.9187 4.2253 11.7744C4.08104 11.6301 4 11.4345 4 11.2305V3.53842C4 3.1304 4.16208 2.7391 4.45059 2.45059C4.7391 2.16208 5.1304 2 5.53841 2H14.7689C14.8699 1.99992 14.97 2.01975 15.0634 2.05836C15.1568 2.09696 15.2416 2.15358 15.3131 2.22499L20.6976 7.60945C20.769 7.68093 20.8256 7.76579 20.8642 7.85917C20.9028 7.95255 20.9226 8.05262 20.9226 8.15366ZM15.5381 7.38445H18.2967L15.5381 4.62588V7.38445Z"
                        fill="#d3d3d3" />
                </svg>

                <div class="">Audio</div>
            </div>
            <div @click="downloadAudio()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M22 14.5V21.1667C22 21.3877 21.9122 21.5996 21.7559 21.7559C21.5996 21.9122 21.3877 22 21.1667 22H2.83333C2.61232 22 2.40036 21.9122 2.24408 21.7559C2.0878 21.5996 2 21.3877 2 21.1667V14.5C2 14.279 2.0878 14.067 2.24408 13.9107C2.40036 13.7545 2.61232 13.6667 2.83333 13.6667C3.05435 13.6667 3.26631 13.7545 3.42259 13.9107C3.57887 14.067 3.66667 14.279 3.66667 14.5V20.3333H20.3333V14.5C20.3333 14.279 20.4211 14.067 20.5774 13.9107C20.7337 13.7545 20.9457 13.6667 21.1667 13.6667C21.3877 13.6667 21.5996 13.7545 21.7559 13.9107C21.9122 14.067 22 14.279 22 14.5ZM11.4104 15.0896C11.4878 15.1671 11.5797 15.2285 11.6809 15.2705C11.782 15.3124 11.8905 15.334 12 15.334C12.1095 15.334 12.218 15.3124 12.3191 15.2705C12.4203 15.2285 12.5122 15.1671 12.5896 15.0896L16.7563 10.9229C16.8729 10.8064 16.9524 10.6578 16.9846 10.4961C17.0168 10.3344 17.0003 10.1667 16.9372 10.0143C16.8741 9.86199 16.7671 9.73179 16.63 9.64023C16.4928 9.54867 16.3316 9.49987 16.1667 9.5H12.8333V2.83333C12.8333 2.61232 12.7455 2.40036 12.5893 2.24408C12.433 2.0878 12.221 2 12 2C11.779 2 11.567 2.0878 11.4107 2.24408C11.2545 2.40036 11.1667 2.61232 11.1667 2.83333V9.5H7.83333C7.66842 9.49987 7.50718 9.54867 7.37002 9.64023C7.23285 9.73179 7.12594 9.86199 7.06281 10.0143C6.99969 10.1667 6.98318 10.3344 7.01539 10.4961C7.0476 10.6578 7.12707 10.8064 7.24375 10.9229L11.4104 15.0896Z"
                        fill="#007C8F" />
                </svg>
            </div>
        </div>
        <div class="flex items-center justify-between gap-x-4">
            <div x-on:click=" playPauseAudio()"
                class="w-7 p-2 bg-[#007c8f] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
                <svg x-show="!isPlaying" width="9" height="10" viewBox="0 0 9 10" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.46113 5C8.46145 5.13058 8.42797 5.25903 8.36394 5.37284C8.29992 5.48665 8.20753 5.58196 8.09577 5.64949L1.16917 9.88678C1.05239 9.95829 0.918642 9.99733 0.781731 9.99987C0.644819 10.0024 0.509713 9.96834 0.390366 9.90121C0.272155 9.83511 0.173682 9.73873 0.105074 9.62196C0.0364653 9.50519 0.000197518 9.37225 0 9.23682V0.763184C0.000197518 0.627751 0.0364653 0.494814 0.105074 0.378045C0.173682 0.261275 0.272155 0.164887 0.390366 0.0987929C0.509713 0.031656 0.644819 -0.00240351 0.781731 0.000131891C0.918642 0.00266729 1.05239 0.0417057 1.16917 0.113215L8.09577 4.35051C8.20753 4.41804 8.29992 4.51335 8.36394 4.62716C8.42797 4.74097 8.46145 4.86942 8.46113 5Z"
                        fill="white" />
                </svg>
                <svg x-show="isPlaying" width="10" height="10" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <path
                        d="M21.3333 3.66667V20.3333C21.3333 20.7754 21.1577 21.1993 20.8452 21.5118C20.5326 21.8244 20.1087 22 19.6667 22H15.5C15.058 22 14.6341 21.8244 14.3215 21.5118C14.0089 21.1993 13.8333 20.7754 13.8333 20.3333V3.66667C13.8333 3.22464 14.0089 2.80072 14.3215 2.48816C14.6341 2.17559 15.058 2 15.5 2H19.6667C20.1087 2 20.5326 2.17559 20.8452 2.48816C21.1577 2.80072 21.3333 3.22464 21.3333 3.66667ZM8.83333 2H4.66667C4.22464 2 3.80072 2.17559 3.48816 2.48816C3.17559 2.80072 3 3.22464 3 3.66667V20.3333C3 20.7754 3.17559 21.1993 3.48816 21.5118C3.80072 21.8244 4.22464 22 4.66667 22H8.83333C9.27536 22 9.69928 21.8244 10.0118 21.5118C10.3244 21.1993 10.5 20.7754 10.5 20.3333V3.66667C10.5 3.22464 10.3244 2.80072 10.0118 2.48816C9.69928 2.17559 9.27536 2 8.83333 2Z"
                        fill="white"></path>
                </svg>
            </div>
            <div x-text="formattedTime" class="text-[#007c8f] label"></div>
            <div class="grow relative">
                <input x-model="currentTime" type="range" min="0" :max="duration" value="0" step="00.01" @input="seek()"
                    class="w-full accent-gray-700  absolute top-1/2 left-0 -translate-y-1/2 bg-transparent cursor-pointer">
            </div>
            <div x-text="formattedRemainingTime" class="label text-[#007c8f]">-17:54</div>
            <div @click="muteUnmuteSound()">
                <svg x-bind:class=" volume==0?'hidden':'block'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.4123 3.70994V20.2114C14.4144 20.3348 14.3844 20.4568 14.3254 20.5652C14.2663 20.6737 14.1801 20.765 14.0752 20.8302C13.9561 20.9011 13.8183 20.9344 13.6799 20.9258C13.5415 20.9172 13.4089 20.8671 13.2995 20.782L7.64758 16.386C7.6066 16.3536 7.57352 16.3123 7.55082 16.2653C7.52813 16.2183 7.51641 16.1667 7.51656 16.1144V7.81202C7.51672 7.75958 7.52883 7.70787 7.55199 7.66082C7.57514 7.61377 7.60872 7.57262 7.65017 7.5405L13.3021 3.14449C13.4259 3.04851 13.5788 2.99758 13.7355 3.00009C13.8921 3.0026 14.0433 3.05839 14.164 3.15828C14.2433 3.22641 14.3067 3.31114 14.3496 3.40647C14.3925 3.50181 14.4139 3.60541 14.4123 3.70994ZM5.79264 7.82581H3.37914C3.01337 7.82581 2.66258 7.97111 2.40394 8.22975C2.1453 8.48839 2 8.83918 2 9.20495V14.7215C2 15.0873 2.1453 15.4381 2.40394 15.6967C2.66258 15.9554 3.01337 16.1007 3.37914 16.1007H5.79264C5.88408 16.1007 5.97178 16.0643 6.03644 15.9997C6.1011 15.935 6.13742 15.8473 6.13742 15.7559V8.1706C6.13742 8.07915 6.1011 7.99146 6.03644 7.9268C5.97178 7.86214 5.88408 7.82581 5.79264 7.82581ZM16.7197 9.62214C16.6516 9.68198 16.596 9.75466 16.556 9.83602C16.5161 9.91738 16.4925 10.0058 16.4868 10.0963C16.481 10.1868 16.4931 10.2775 16.5224 10.3632C16.5518 10.449 16.5977 10.5282 16.6577 10.5962C16.9903 10.9739 17.1738 11.4599 17.1738 11.9632C17.1738 12.4665 16.9903 12.9526 16.6577 13.3303C16.5961 13.398 16.5486 13.4772 16.518 13.5634C16.4873 13.6495 16.4741 13.741 16.4791 13.8323C16.4842 13.9236 16.5073 14.013 16.5472 14.0953C16.5871 14.1777 16.643 14.2512 16.7116 14.3117C16.7802 14.3722 16.8602 14.4184 16.9469 14.4477C17.0335 14.477 17.1251 14.4887 17.2164 14.4823C17.3076 14.4758 17.3967 14.4513 17.4783 14.4101C17.56 14.3689 17.6326 14.3118 17.692 14.2423C18.2467 13.6126 18.5527 12.8023 18.5527 11.9632C18.5527 11.1241 18.2467 10.3138 17.692 9.6842C17.6322 9.61598 17.5595 9.56025 17.478 9.52019C17.3966 9.48014 17.308 9.45655 17.2175 9.45078C17.1269 9.44502 17.0361 9.45719 16.9502 9.48659C16.8644 9.516 16.7852 9.56206 16.7172 9.62214H16.7197ZM20.2443 7.36639C20.185 7.29547 20.112 7.2372 20.0297 7.19507C19.9474 7.15293 19.8574 7.12777 19.7652 7.1211C19.673 7.11443 19.5803 7.12637 19.4928 7.15623C19.4053 7.18608 19.3247 7.23322 19.2558 7.29487C19.1868 7.35651 19.131 7.43138 19.0916 7.51503C19.0522 7.59869 19.03 7.68941 19.0264 7.78181C19.0228 7.8742 19.0378 7.96639 19.0705 8.05287C19.1032 8.13936 19.153 8.21838 19.2168 8.28524C20.1216 9.29669 20.6219 10.6062 20.6219 11.9632C20.6219 13.3203 20.1216 14.6298 19.2168 15.6412C19.153 15.7081 19.1032 15.7871 19.0705 15.8736C19.0378 15.9601 19.0228 16.0523 19.0264 16.1447C19.03 16.2371 19.0522 16.3278 19.0916 16.4114C19.131 16.4951 19.1868 16.57 19.2558 16.6316C19.3247 16.6932 19.4053 16.7404 19.4928 16.7702C19.5803 16.8001 19.673 16.812 19.7652 16.8054C19.8574 16.7987 19.9474 16.7735 20.0297 16.7314C20.112 16.6893 20.185 16.631 20.2443 16.5601C21.3749 15.2959 22 13.6593 22 11.9632C22 10.2672 21.3749 8.63061 20.2443 7.36639Z"
                        fill="#007C8F" />
                </svg>
                <svg x-bind:class="volume==0?'block':'hidden'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" class="block">
                    <path
                        d="M21.7979 13.5452C21.9273 13.6746 22 13.8501 22 14.0331C22 14.2161 21.9273 14.3916 21.7979 14.521C21.6685 14.6504 21.493 14.7231 21.31 14.7231C21.127 14.7231 20.9515 14.6504 20.8221 14.521L19.241 12.9391L17.66 14.521C17.5306 14.6504 17.3551 14.7231 17.1721 14.7231C16.9891 14.7231 16.8136 14.6504 16.6842 14.521C16.5548 14.3916 16.4821 14.2161 16.4821 14.0331C16.4821 13.8501 16.5548 13.6746 16.6842 13.5452L18.2661 11.9642L16.6842 10.3832C16.5548 10.2538 16.4821 10.0782 16.4821 9.89524C16.4821 9.71223 16.5548 9.53672 16.6842 9.40732C16.8136 9.27791 16.9891 9.20521 17.1721 9.20521C17.3551 9.20521 17.5306 9.27791 17.66 9.40732L19.241 10.9892L20.8221 9.40732C20.9515 9.27791 21.127 9.20521 21.31 9.20521C21.493 9.20521 21.6685 9.27791 21.7979 9.40732C21.9273 9.53672 22 9.71223 22 9.89524C22 10.0782 21.9273 10.2538 21.7979 10.3832L20.216 11.9642L21.7979 13.5452ZM5.79303 7.82631H3.37928C3.01348 7.82631 2.66265 7.97163 2.40398 8.2303C2.14532 8.48896 2 8.83979 2 9.2056V14.7227C2 15.0885 2.14532 15.4394 2.40398 15.698C2.66265 15.9567 3.01348 16.102 3.37928 16.102H5.79303C5.88448 16.102 5.97219 16.0657 6.03686 16.001C6.10152 15.9364 6.13785 15.8486 6.13785 15.7572V8.17113C6.13785 8.07968 6.10152 7.99198 6.03686 7.92731C5.97219 7.86264 5.88448 7.82631 5.79303 7.82631ZM14.1679 3.1583C14.0471 3.0584 13.896 3.0026 13.7393 3.00009C13.5826 2.99758 13.4297 3.04852 13.3058 3.14451L7.65334 7.54098C7.61141 7.57283 7.57733 7.61387 7.55372 7.66094C7.53011 7.70801 7.5176 7.75986 7.51714 7.81252V16.1158C7.51729 16.1683 7.52941 16.22 7.55256 16.267C7.57572 16.3141 7.6093 16.3552 7.65075 16.3874L13.3032 20.7838C13.4127 20.8689 13.5453 20.9191 13.6837 20.9277C13.8221 20.9363 13.9599 20.903 14.0791 20.8321C14.184 20.7669 14.2701 20.6755 14.3292 20.5671C14.3883 20.4586 14.4182 20.3366 14.4161 20.2131V3.71001C14.4174 3.60527 14.3956 3.50153 14.3523 3.40617C14.3089 3.31082 14.2451 3.22618 14.1653 3.1583H14.1679Z"
                        fill="#007C8F"></path>
                </svg>
            </div>
        </div>
        <audio class="hidden" x-ref="audioElement" @timeupdate="updateProgress()" @loadedmetadata="loadMetadatafn()"
            @volumeChange="updateVolume()" @ended="isPlaying = false" src=${audioURL} controls></audio>
    </div>
    `;
                    previewContainer.innerHTML = audioPlayerHTML;
                    Alpine.initTree(previewContainer);
                }

                else {
                    let badgeClass = "bg-[#c7e6e6] text-[#007c82] p-4 rounded flex items-center justify-between";
                    previewContainer.innerHTML = `
    <span class="${badgeClass}">
        <span class="flex items-center gap-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M20.6981 7.60962L15.3135 2.225C15.242 2.15359 15.1571 2.09696 15.0637 2.05836C14.9704 2.01975 14.8703 1.99992 14.7692 2H5.53846C5.13044 2 4.73912 2.16209 4.4506 2.45061C4.16209 2.73912 4 3.13044 4 3.53846V20.4615C4 20.8696 4.16209 21.2609 4.4506 21.5494C4.73912 21.8379 5.13044 22 5.53846 22H19.3846C19.7926 22 20.184 21.8379 20.4725 21.5494C20.761 21.2609 20.9231 20.8696 20.9231 20.4615V8.15385C20.9232 8.0528 20.9033 7.95273 20.8647 7.85935C20.8261 7.76597 20.7695 7.68111 20.6981 7.60962ZM15.5385 16.6154H9.38462C9.1806 16.6154 8.98495 16.5343 8.84069 16.3901C8.69643 16.2458 8.61538 16.0502 8.61538 15.8462C8.61538 15.6421 8.69643 15.4465 8.84069 15.3022C8.98495 15.158 9.1806 15.0769 9.38462 15.0769H15.5385C15.7425 15.0769 15.9381 15.158 16.0824 15.3022C16.2266 15.4465 16.3077 15.6421 16.3077 15.8462C16.3077 16.0502 16.2266 16.2458 16.0824 16.3901C15.9381 16.5343 15.7425 16.6154 15.5385 16.6154ZM15.5385 13.5385H9.38462C9.1806 13.5385 8.98495 13.4574 8.84069 13.3132C8.69643 13.1689 8.61538 12.9732 8.61538 12.7692C8.61538 12.5652 8.69643 12.3696 8.84069 12.2253C8.98495 12.081 9.1806 12 9.38462 12H15.5385C15.7425 12 15.9381 12.081 16.0824 12.2253C16.2266 12.3696 16.3077 12.5652 16.3077 12.7692C16.3077 12.9732 16.2266 13.1689 16.0824 13.3132C15.9381 13.4574 15.7425 13.5385 15.5385 13.5385ZM14.7692 8.15385V3.92308L19 8.15385H14.7692Z"
                    fill="#007C8F" />
            </svg>
            ${file.name}
        </span>
        <span>
            <svg id="previewTheFileInNextTab" width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M21.9425 11.3967C21.9133 11.3308 21.2075 9.765 19.6383 8.19584C17.5475 6.105 14.9067 5 12 5C9.09333 5 6.4525 6.105 4.36166 8.19584C2.79249 9.765 2.08333 11.3333 2.05749 11.3967C2.01959 11.4819 2 11.5742 2 11.6675C2 11.7608 2.01959 11.8531 2.05749 11.9383C2.08666 12.0042 2.79249 13.5692 4.36166 15.1383C6.4525 17.2283 9.09333 18.3333 12 18.3333C14.9067 18.3333 17.5475 17.2283 19.6383 15.1383C21.2075 13.5692 21.9133 12.0042 21.9425 11.9383C21.9804 11.8531 22 11.7608 22 11.6675C22 11.5742 21.9804 11.4819 21.9425 11.3967ZM12 15C11.3407 15 10.6963 14.8045 10.1481 14.4382C9.59993 14.072 9.17269 13.5514 8.9204 12.9423C8.66811 12.3332 8.6021 11.663 8.73071 11.0164C8.85933 10.3698 9.1768 9.77582 9.64298 9.30965C10.1092 8.84347 10.7031 8.526 11.3497 8.39738C11.9963 8.26877 12.6665 8.33478 13.2756 8.58707C13.8847 8.83936 14.4053 9.26661 14.7716 9.81477C15.1378 10.3629 15.3333 11.0074 15.3333 11.6667C15.3333 12.5507 14.9821 13.3986 14.357 14.0237C13.7319 14.6488 12.8841 15 12 15Z"
                    fill="#007C8F" />
            </svg>
        </span>
    </span>`;
                    const previewSvg = document.getElementById("previewTheFileInNextTab");
                    if (previewSvg) {
                        previewSvg.addEventListener("click", function (e) {
                            e.stopPropagation();
                            if (currentFile) {
                                const fileURL = URL.createObjectURL(currentFile);
                                window.open(fileURL, "_blank");
                            }
                        });
                    }
                }
            }
        });

        deleteBtn.addEventListener("click", function () {
            resetFileSelection();
        });

        replaceBtn.addEventListener("click", function () {
            resetFileSelection();
            fileInput.click();
        });
    });

    function toggleReplyForm(replyID) {
        const replyFormID = 'replyFormBox_' + replyID;

        const targetElement = document.getElementById(replyFormID);

        if (targetElement) {
            const isVisible = !targetElement.classList.contains('hidden');

            if (isVisible) {
                targetElement.classList.add('hidden');

            }
            else {
                document.querySelectorAll('[id^="commentBox_"], [id^="replyFormBox_"]').forEach(el => {
                    el.classList.add('hidden');
                });

                targetElement.classList.remove('hidden');

                const yOffset = -150;
                const y = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });

            }
        } else {

        }
    }

    function toggleCommentBox(actualPostID) {
        const clickedCommentBox = document.getElementById('commentBox_' + actualPostID);
        if (clickedCommentBox) {
            // First, hide all comment boxes except the clicked one
            const allCommentBoxes = document.querySelectorAll('[id^="commentBox_"]');
            allCommentBoxes.forEach(box => {
                if (box !== clickedCommentBox) {
                    box.classList.add('hidden');
                }
            });

            // Hide all reply form boxes except the one matching the clicked post ID
            const clickedReplyFormBox = document.getElementById('replyFormBox_' + actualPostID);
            const allReplyFormBoxes = document.querySelectorAll('[id^="replyFormBox_"]');
            allReplyFormBoxes.forEach(box => {
                if (box !== clickedReplyFormBox) {
                    box.classList.add('hidden');
                }
            });

            // Then toggle the clicked comment box
            clickedCommentBox.classList.toggle('hidden');

            // Scroll to the clicked comment box if it's now visible
            if (!clickedCommentBox.classList.contains('hidden')) {
                const yOffset = -150;
                const y = clickedCommentBox.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }

    function deletefiledata($el) {
        const container = $el.closest('.bg-\\[\\#f5f5f5\\]');
        const fileInput = container.querySelector('input[type="file"]');
        fileInput.value = '';
        container.querySelector('[previewcontainerforfiles]').classList.add('hidden');
        container.querySelector('[previewcontainerforfiles]').innerHTML = '';
        const buttons = container.querySelectorAll('.outlineButton.text-label');
        buttons.forEach(btn => btn.classList.add('hidden'));
        container.querySelector('button.outlineButton').classList.remove('hidden');
    }

    function replaceFileData($el) {
        const container = $el.closest('.bg-\\[\\#f5f5f5\\]');
        const fileInput = container.querySelector('input[type="file"]');
        fileInput.click();
    }


    function attachAllFileData($el) {
        populatePreviewContainer($el);
        const container = $el.closest('.bg-\\[\\#f5f5f5\\]');
        container.querySelector('[previewcontainerforfiles]').classList.remove('hidden');
        const buttons = $el.closest('.flex.items-center.justify-end.gap-2').querySelectorAll('.outlineButton.text-label');
        buttons.forEach(btn => btn.classList.remove('hidden'));
        $el.closest('button').classList.add('hidden');
    }

    if (typeof window.audioPlayerss === 'undefined') {
        window.audioPlayerss = [];
    }

    function audioPlayer() {
        return {
            currentTime: 0,
            duration: 0,
            isPlaying: false,
            volume: 1,

            initPlayer() {
                if (typeof window.audioPlayerss === 'undefined') {
                    window.audioPlayerss = [];
                }
                window.audioPlayerss.push(this);
            },

            muteUnmuteSound() {
                if (this.volume == 0) {
                    this.volume = 1;
                    this.$refs.audioElement.volume = 1;
                } else {
                    this.$refs.audioElement.volume = 0;
                    this.volume = 0;
                }
            },

            updateVolume() {
                this.volume = this.$refs.audioElement.volume;
            },

            seek() {
                this.$refs.audioElement.currentTime = this.currentTime
            },

            updateProgress() {
                this.currentTime = this.$refs.audioElement.currentTime.toFixed(2)
            },

            loadMetadatafn() {
                this.duration = this.$refs.audioElement.duration
            },

            playPauseAudio() {
                // Toggle the current player state
                if (!this.isPlaying) {
                    // First pause any other playing audio
                    window.audioPlayerss.forEach(player => {
                        if (player !== this && player.isPlaying) {
                            player.$refs.audioElement.pause();
                            player.isPlaying = false;
                        }
                    });

                    // Then play this audio
                    this.$refs.audioElement.play()
                        .then(() => {
                            this.isPlaying = true;
                        })
                        .catch(error => {

                        });
                } else {
                    this.$refs.audioElement.pause();
                    this.isPlaying = false;
                }
            },

            formattedTime() {
                let hours = Math.floor(this.currentTime / 3600);
                let minutes = Math.floor((this.currentTime % 3600) / 60);
                let seconds = Math.floor(this.currentTime % 60);

                return (hours ? hours + ':' : '') +
                    (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            }, formattedRemainingTime() {
                let
                remaining = this.duration - this.currentTime; let minutes = Math.floor(remaining / 60); let
                    seconds = Math.floor(remaining % 60); return '-' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10
                        ? '0' : '') + seconds;
            }, downloadAudio() {
                let a = document.createElement('a');
                a.href = this.$refs.audioElement.src; a.download = 'audio.mp3'; a.click();
            }
        };
    } async function
        uploadRepliesWithFile($el) {
            const thisComment = $el.closest("[comment-id]"); if (!thisComment) return; const
                commentId = thisComment.getAttribute("comment-id"); const inputEl = thisComment.querySelector(".mentionable"); const
                    commentText = inputEl ? inputEl.innerHTML.trim() : ""; const
                        mentionIDs = gatherMentionsFromElement(inputEl).map(id => ({ id: Number(id) }));
        if (inputEl) {
            inputEl.innerHTML = "";
        }
        if (!commentText) return;
        let fileData = null;
        const fileInputEl = thisComment.querySelector('input[type="file"]');
        if (fileInputEl && fileInputEl.files && fileInputEl.files.length > 0) {
            const file = fileInputEl.files[0];
            const fileFields = [{ fieldName: "file_content", file }];
            if (fileFields.length > 0) {
                const toSubmitFields = {};
                await processFileFields(toSubmitFields, fileFields, awsParam, awsParamUrl);
                fileData = typeof toSubmitFields.file_content === "string"
                    ? JSON.parse(toSubmitFields.file_content)
                    : toSubmitFields.file_content;
                fileData.name = fileData.name || file.name;
                fileData.size = fileData.size || file.size;
                fileData.type = fileData.type || file.type;
            }
        }
        const replyData = {
            Author_Display_Name: contactDisplayName,
            Comment: commentText,
            Date_Added: Math.floor(Date.now() / 1000),
            ID: `${Date.now()}`,
            Author_Profile_Image: visitorProfilePicture,
            Author_Is_Instructor: isThisVisitorAnInstructor === "Yes",
            Author_Is_Admin: isContactAdmin === "Yes",
            Author_ID: Number(contactIdOfThisVisitor),
            file: fileData ? JSON.stringify(fileData) : null
        };
        const rTmpl = $.templates("#replyTemplate");
        const tempWrapper = document.createElement("div");
        tempWrapper.innerHTML = rTmpl.render(replyData);
        const tempReplyElement = tempWrapper.firstElementChild;
        tempReplyElement.style.pointerEvents = "none";
        tempReplyElement.style.opacity = "0.5";
        const replyContainer = thisComment.querySelector(".replyShowContainer");
        if (replyContainer) {
            replyContainer.appendChild(tempReplyElement);
        } else {

            return;
        }
        const payload = {
            comment: commentText,
            reply_to_comment_id: commentId,
            author_id: Number(contactIdOfThisVisitor),
            Mentions: mentionIDs,
            file: fileData ? fileData : null
        };
        if (fileData) {
            const filePreviewContainer = tempReplyElement.querySelector(".filePreviewContainerReply");

        }
        try {
            const createdReply = await createReply(payload);

            if (createdReply && createdReply.id) {

                tempReplyElement.setAttribute("reply-id", createdReply.id);
                tempReplyElement.style.opacity = "1";
                tempReplyElement.style.pointerEvents = "auto";
                const authorNameEl = tempReplyElement.querySelector(".text-button");
                if (authorNameEl) {
                    authorNameEl.textContent = visitorFirstName + " " + visitorLastName;;
                }
                if (fileData) {

                    let serverFileData;
                    if (createdReply.data && createdReply.data.createForumComment) {
                        serverFileData = createdReply.data.createForumComment.file;
                    } else {
                        serverFileData = createdReply.file;
                    }
                    if (serverFileData) {

                        const cleanLink = typeof serverFileData === "string"
                            ? serverFileData.replace(/^"(.+)"$/, '$1')
                            : serverFileData.link;
                        const combinedFileData = {
                            name: fileData.name,
                            type: fileData.type,
                            link: cleanLink
                        };

                        const analyzedObject = analyzeFile(combinedFileData);
                        const filePreviewHtml = generateFilePreview(analyzedObject);
                        const filePreviewContainer = tempReplyElement.querySelector(".filePreviewContainerReply");
                        if (filePreviewContainer) {
                            filePreviewContainer.innerHTML = filePreviewHtml || "";
                        } else {

                        }
                    } else {

                    }
                }
                handleRepliesCount(thisComment);
            } else {
                throw new Error("createReply returned invalid data");
            }
        } catch (err) {

            if (!tempReplyElement.getAttribute("reply-id")) {
                tempReplyElement.remove();
                alert("An error occurred while posting the reply.");
            }
        } finally {


            thisComment.querySelectorAll('.outlineButton.text-label').forEach(el => {
                el.classList.add('hidden');
            });
            thisComment.querySelector('.outlineButton.flex.relative').classList.remove('hidden');





            if (fileInputEl) {
                fileInputEl.value = "";
            }
            const previewContainer = thisComment.querySelector("[previewcontainerforfiles]");
            if (previewContainer) {
                previewContainer.innerHTML = "";
                previewContainer.classList.add("hidden");
            }
        }
    }

    async function uploadCommentWithFile(element) {
        const commentContainer = element.closest("[id^='commentBox_']");
        commentContainer.classList.add("opacity-50", "pointer-events-none");
        const thisPost = element.closest(".forum-post");
        const authorId = Number(contactIdOfThisVisitor);
        const postId = Number(thisPost.getAttribute("current-post-id"));

        const inputEl = commentContainer.querySelector(".mentionable");
        const commentText = inputEl ? inputEl.innerHTML.trim() : "";
        const mentionIDs = gatherMentionsFromElement(inputEl).map(id => ({ id: Number(id) }));
        inputEl.innerHTML = "";
        inputEl.removeAttribute("data-tribute-attached");

        let fileData = null;
        const fileInputEl = commentContainer.querySelector('input[type="file"]');
        if (!commentText) {
            commentContainer.classList.remove("opacity-50", "pointer-events-none");
            return;
        }
        if (fileInputEl && fileInputEl.files && fileInputEl.files.length > 0) {
            const file = fileInputEl.files[0];
            const fileFields = [{ fieldName: "file_content", file }];
            if (fileFields.length > 0) {
                const toSubmitFields = {};
                await processFileFields(toSubmitFields, fileFields, awsParam, awsParamUrl);
                fileData = typeof toSubmitFields.file_content === "string"
                    ? JSON.parse(toSubmitFields.file_content)
                    : toSubmitFields.file_content;
                fileData.name = fileData.name || file.name;
                fileData.size = fileData.size || file.size;
                fileData.type = fileData.type || file.type;
            }
        }



        const commentContainerElem = thisPost.querySelector("#allCommentsForPostContainer");
        const manualData = [{
            ID: `${Date.now()}`,
            // Author_Display_Name: contactDisplayName || "Anonymous",
            Author_Display_Name: contactDisplayName || ((contactFirstName || contactLastName) ? `${contactFirstName ?? ''}
        ${contactLastName ?? ''}`.trim() : "Anonymous"),
            Comment: commentText,
            Date_Added: Math.floor(Date.now() / 1000),
            Author_Profile_Image: visitorProfilePicture,
            Author_Is_Instructor: isThisVisitorAnInstructor === "Yes",
            ForumCommentsTotalCount: 0,
            Author_Is_Admin: isContactAdmin !== "No",
            Author_ID: Number(visitorContactID),
            File: fileData ? JSON.stringify(fileData) : null
        }];


        const commentTmpl = $.templates("#commentTemplate");
        $.views.helpers({
            elapsedTime: convertToElapsedTime,
            filePreview: function (file) {
                if (file) {
                    if (typeof file === 'string') {
                        try {
                            file = JSON.parse(file);
                        } catch (e) {

                        }
                    }
                    const analyzedObject = analyzeFile(file);
                    return generateFilePreview(analyzedObject);
                }
                return "";
            }
        });
        const renderedHtml = commentTmpl.render(manualData);
        const tempWrapper = document.createElement("div");
        tempWrapper.innerHTML = renderedHtml;
        while (tempWrapper.firstChild) {
            commentContainerElem.appendChild(tempWrapper.firstChild);
        }

        let tempEl = commentContainerElem.lastElementChild;
        tempEl.classList.add("opacity-50", "pointer-events-none");

        if (fileData) {
            const filePreviewContainer = tempEl.querySelector(".filePreviewContainer");
            commentContainer.querySelectorAll('.outlineButton.text-label').forEach(el => {
                el.classList.add('hidden');
            });

        }

        try {
            const createdComment = await postComment(
                postId,
                authorId,
                commentText,
                mentionIDs,
                fileData ? fileData : null
            );
            if (createdComment?.data?.createForumComment?.author_id &&
                createdComment?.data?.createForumComment?.comment) {
                const newId = Object.values(createdComment.extensions.pkMap)[0];
                tempEl.classList.remove("opacity-50", "pointer-events-none");
                tempEl.setAttribute("comment-id", newId);
                let element = tempEl.querySelector("[id^='reply-']");
                if (element) {
                    element.id = `reply-${newId}`;
                }

                const authorNameEl = tempEl.querySelector(".text-button");
                if (authorNameEl) {
                    authorNameEl.textContent = `${visitorFirstName} ${visitorLastName}`;
                }

                // Update comment text
                const commentTextEl = Array.from(tempEl.children).find(el => el.tagName === "DIV" && el.innerHTML ===
                    commentText);
                if (commentTextEl) {
                    commentTextEl.innerHTML = commentText;
                } else {

                }

                // Update file preview with combined data
                if (fileData && createdComment.data.createForumComment.file) {
                    const serverFileData = createdComment.data.createForumComment.file;
                    const cleanLink = typeof serverFileData === "string"
                        ? serverFileData.replace(/^"(.+)"$/, '$1')
                        : serverFileData.link;

                    const combinedFileData = {
                        name: fileData.name,
                        type: fileData.type,
                        link: cleanLink
                    };
                    const analyzedObject = analyzeFile(combinedFileData);
                    const filePreviewHtml = generateFilePreview(analyzedObject);
                    const filePreviewContainer = tempEl.querySelector(".filePreviewContainer");
                    if (filePreviewContainer) {
                        filePreviewContainer.innerHTML = filePreviewHtml || "";
                    } else {

                    }
                }

                fetchCommentCount(thisPost.getAttribute("current-post-id"));
            } else {
                throw new Error("createForumComment returned invalid data");
            }
        } catch (err) {
            tempEl.remove();
            alert("An error occurred while posting the comment.");
        } finally {
            commentContainer.classList.remove("opacity-50", "pointer-events-none");
            if (fileInputEl) {
                fileInputEl.value = "";
            }
            const previewContainer = commentContainer.querySelector("[previewcontainerforfiles]");
            if (previewContainer) {
                previewContainer.innerHTML = "";
                previewContainer.classList.add("hidden");
            }


            commentContainer.querySelectorAll('.outlineButton.text-label').forEach(el => {
                el.classList.add('hidden');
            });
            commentContainer.querySelector('.outlineButton.flex.relative').classList.remove('hidden');


        }
    }

    function decodeAwsParam(awsParam) {
        if (!awsParam) {
            awsParam = window.awsParam;
        }

        const serializedString = atob(awsParam);

        const hashMatch = serializedString.match(/s:\d+:"([a-f0-9]+)"/);


        const expiryMatch = serializedString.match(/i:(\d+)/);

        return {
            hash: hashMatch ? hashMatch[1] : null,
            expiry: expiryMatch ? parseInt(expiryMatch[1], 10) : null,
        };
    }


    function encodeAwsParam(hash, currentEpoch) {
        if (typeof currentEpoch !== "number") {
            currentEpoch = Math.round(Date.now() / 1000);
        }
        const expiry = new Date(currentEpoch * 1000);

        expiry.setTime(expiry.getTime() + 12 * 60 * 60 * 1000);
        return btoa(
            `a:2:{s:4:"hash";s:${hash.length}:"${hash}";s:6:"expiry";i:${Math.round(
                expiry.getTime() / 1000
            )};}`
        );
    }

    function createS3FileId(key, filename) {
        return `${key.replace("_${filename}", "")}_${filename}`;
    }


    function getS3UploadParams(awsParam, url) {
        if (typeof awsParam !== "string") {
            awsParam = window.awsParam;
        }
        if (typeof url !== "string") {
            url = `//${window.location.host}/s/aws`;
        }
        const formData = new FormData();
        formData.append("awsParam", JSON.stringify(awsParam));
        return fetch(url, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((object) => {
                if (object.code === 0 && object.data) {
                    return object.data;
                }

                return null;
            });

    }

    function uploadFiles(filesToUpload, s3Params, toSubmit) {
        const paramsInputs = s3Params.inputs;
        const method = s3Params.attributes.method;
        const action = s3Params.attributes.action;
        const uploadPromises = filesToUpload.map(({ file, fieldName }) => {
            return new Promise((resolve) => {
                let s3FormData = new FormData();

                for (const key in paramsInputs) {
                    s3FormData.append(key, paramsInputs[key]);
                }
                s3FormData.append("Content-Type", file.type);
                s3FormData.append("file", file, file.name);

                let xhr = new XMLHttpRequest();
                xhr.open(method, action);

                xhr.onloadend = function () {
                    if (xhr.status === 204) {
                        let s3Id = createS3FileId(paramsInputs.key, file.name);
                        const result = {
                            name: file.name,
                            type: file.type,
                            s3_id: s3Id,
                        };
                        if (toSubmit && fieldName) {
                            toSubmit[fieldName] = JSON.stringify(result);
                        }
                        resolve(result);
                    } else {

                        resolve(null);
                    }
                };

                xhr.send(s3FormData);
            });
        });

        return Promise.all(uploadPromises);
    }

    function processFileFields(toSubmit, filesToUpload, awsParamHash, awsParamUrl) {
        let awsParam;
        if (!awsParamHash) {
            awsParam = window.awsParam;
        } else if (typeof awsParamHash === "string") {
            awsParam = encodeAwsParam(awsParamHash);
        }

        return getS3UploadParams(awsParam, awsParamUrl).then((s3Params) => {
            if (!s3Params) {
                const e = new Error("Failed to retrieve s3Params.");
                e.failures = filesToUpload;
                throw e;
            }
            return uploadFiles(filesToUpload, s3Params, toSubmit).then((result) => {
                let error;
                for (let i = 0; i < result.length; i++) {
                    if (!result[i]) {
                        if (!error) {
                            error = new Error("One or more files
            failed to upload."); error.failures=[]; } error.failures.push(filesToUpload[i]); } } if (error) { throw
            error;
                        } return toSubmit;
                    });
        });
    } function decodeAwsParam(awsParam) {
        if (!awsParam) {
            awsParam = window.awsParam;
        } // Decode base64. // The decoded string will look like this (serialized PHP
            Array): // a:2:{s:4:"hash";s:32:"93be5a7f9d5fac17dfcc5c99870154a4";s:6:"expiry";i:1739195884;} const
        serializedString = atob(awsParam); // Extract hash portion from serialized PHP array, which // is the `s:32:`
        property in the example decoded string above.const hashMatch = serializedString.match(/s:\d+:"([a-f0-9]+)"/);
            // Extract expiry portion from serialized PHP array, which // is the `i:` property in the example decoded
            string above.const expiryMatch = serializedString.match(/i:(\d+)/); return {
            hash: hashMatch ? hashMatch[1] :
                null, expiry: expiryMatch ? parseInt(expiryMatch[1], 10) : null,
        };
    } function encodeAwsParam(hash,
        currentEpoch) {
            if (typeof currentEpoch !== "number") { currentEpoch = Math.round(Date.now() / 1000); } const
                expiry = new Date(currentEpoch * 1000); expiry.setTime(expiry.getTime() + 12 * 60 * 60 * 1000); return btoa(
                    `a:2:{s:4:"hash";s:${hash.length}:"${hash}";s:6:"expiry";i:${Math.round(expiry.getTime() / 1000)};}`);
    }
    function createS3FileId(key, filename) { return `${key.replace("_${filename}", "")}_${filename}`; }
    function getS3UploadParams(awsParam, url) {
        if (typeof awsParam !== "string") { awsParam = window.awsParam; }
        if (typeof url !== "string") { url = `//${window.location.host}/s/aws`; } const formData = new FormData();
        formData.append("awsParam", JSON.stringify(awsParam)); return fetch(url, {
            method: "POST", body: formData,
        }).then((res) => res.json())
            .then((object) => {
                if (object.code === 0 && object.data) {
                    return object.data;
                }

                return null;
            });
        // Uncomment to implement your own error handling process.
        // .catch(e => {})
    }


    function uploadFiles(filesToUpload, s3Params, toSubmit) {
        const paramsInputs = s3Params.inputs;
        const method = s3Params.attributes.method;
        const action = s3Params.attributes.action;
        const uploadPromises = filesToUpload.map(({ file, fieldName }) => {
            return new Promise((resolve) => {
                let s3FormData = new FormData();

                // Append all required S3 fields
                for (const key in paramsInputs) {
                    s3FormData.append(key, paramsInputs[key]);
                }
                // Append the actual file
                s3FormData.append("Content-Type", file.type);
                s3FormData.append("file", file, file.name);

                let xhr = new XMLHttpRequest();
                xhr.open(method, action);

                xhr.onloadend = function () {
                    if (xhr.status === 204) {
                        let s3Id = createS3FileId(paramsInputs.key, file.name);
                        const result = {
                            name: file.name,
                            type: file.type,
                            s3_id: s3Id,
                        };
                        if (toSubmit && fieldName) {
                            toSubmit[fieldName] = JSON.stringify(result);
                        }
                        resolve(result);
                    } else {
                        resolve(null);
                    }
                };

                xhr.send(s3FormData);
            });
        });

        return Promise.all(uploadPromises);
    }

    function processFileFields(toSubmit, filesToUpload, awsParamHash, awsParamUrl) {
        let awsParam;
        if (!awsParamHash) {
            awsParam = window.awsParam;
        } else if (typeof awsParamHash === "string") {
            awsParam = encodeAwsParam(awsParamHash);
        }

        return getS3UploadParams(awsParam, awsParamUrl).then((s3Params) => {
            if (!s3Params) {
                const e = new Error("Failed to retrieve s3Params.");
                e.failures = filesToUpload;
                throw e;
            }
            return uploadFiles(filesToUpload, s3Params, toSubmit).then((result) => {
                let error;
                for (let i = 0; i < result.length; i++) {
                    if (!result[i]) {
                        if (!error) {
                            error = new Error("One or more files
                failed to upload."); error.failures=[]; } error.failures.push(filesToUpload[i]); } } if (error) { throw
                error;
                        } return toSubmit;
                    });
        });
    } function gatherMentionsFromElement(el) {
        const
        mentionEls = el.querySelectorAll(".mention-handle[data-mention-id]"); return [...mentionEls].map(m =>
            m.getAttribute("data-mention-id"));
    }
    let globalTribute = null;
    let mentionArrays = {};
    async function fetchContactsAndInitializeTribute(classId) {
        const combinedQueryForAdminTeacherAndStudents = `
                query calcContacts($class_id: AwcClassID, $id: AwcClassID) {
                calcContacts(
                query: [
                {
                where: {
                Enrolments: [{ where: { class_id: $class_id } }]
                }
                }
                { orWhere: { Classes: [{ where: { id: $id } }] } }
                { orWhere: { email: "courses@writerscentre.com.au" } }
                ]
                ) {
                Display_Name: field(arg: ["display_name"])
                Contact_ID: field(arg: ["id"])
                Profile_Image: field(arg: ["profile_image"])
                Is_Instructor: field(arg: ["is_instructor"])
                Is_Admin: field(arg: ["is_admin"])
                }
                }
                `;
        const variables = { class_id: classId, id: classId };
        const defaultImageUrl =
            "https://file.ontraport.com/media/d297d307c0b44ab987c4c3ea6ce4f4d1.phpn85eue?Expires=4894682981&Signature=ITOEXhMnfN8RhJFBAPNE1r88KEv0EiFdNUDs1XFJWHGM-VHUgvnRlmbUxX6NrMESiC0IcQBi~Ev-jWHzgWDaUhEQOkljQgB2uLQHrxc2wlH~coXW8ZHT0aOWH160uZd5a6gUgnZWzNoIFU01RQZsxHjvc4Ds~lUpCiIeAKycYgwvZsPv5ir1tKuH~o7HUjfmCNdbStVMhSzfmyvsgP6uDCFspM19KtePjXy~rWteI8vFqltP28VLVNhUVCJ3jT29DiHdZRMYMeDUWVdYFBgebh~cCepChYOMG1ZGlfun9YtYDLuA7O93C2COEScR~gfomDrBDU5dgFXspiXnbTp58w__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA";
        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({
                    query: combinedQueryForAdminTeacherAndStudents,
                    variables
                })
            });
            if (!response.ok) throw new Error("HTTP Error");
            const result = await response.json();
            if (!result?.data?.calcContacts) {
                console.error("Invalid response structure:", result);
                return;
            }
            // const finalContacts = result.data.calcContacts.map(contact => {
            const finalContacts = result.data.calcContacts
                .filter(contact => contact.Display_Name)
                .map(contact => {
                    let userType = "(Student)";
                    if (contact.Is_Admin) {
                        userType = "(Admin)";
                    } else if (contact.Is_Instructor) {
                        userType = "(Tutor)";
                    }
                    return {
                        key: `${contact.Display_Name} ${userType}`,
                        value: String(contact.Contact_ID),
                        image: contact.Profile_Image || defaultImageUrl
                    };
                });
            globalTribute = new Tribute({

                values: finalContacts,
                menuItemTemplate: function (item) {
                    return `
                <div class="cursor-pointer inline-flex items-center gap-x-1">
                    <img src="${item.original.image}" style="object-fit:cover;height:20px;width:20px;border-radius:50%">
                    <span>${item.string}</span>
                </div>
                `;
                },
                selectTemplate: function (item) {
                    return `<span class="mention-handle label bg-[#C7E6E6] py-1 px-2 rounded text-dark small-text"
                    data-mention-id="${item.original.value}">@${item.original.key}</span>`;
                }


            });
            document.querySelectorAll(".mentionable").forEach(el => {
                globalTribute.attach(el);
            });
        } catch (e) {
            console.error("Error fetching contacts:", e);
        }
    }
    fetchContactsAndInitializeTribute(classId);

    function handleRepliesCount(el) {

        const commentElement = el.closest("[comment-id]");

        if (!commentElement) {

            return;
        }

        // Retrieve the comment ID properly (without square brackets)
        const commentNumber = Number(commentElement.getAttribute("comment-id"));

        if (commentNumber) {
            handleReplyCount(commentNumber);
        } else {

        }
    }

    function handleCommentCounts(el) {
        let postContainer = el.closest('[current-post-id]');

        if (!postContainer) {

            return;
        }

        let postId = parseInt(postContainer.getAttribute('current-post-id'), 10);

        if (!isNaN(postId)) {
            if (typeof fetchCommentCount === 'function') {
                fetchCommentCount(postId);
            } else {

            }
        } else {

        }
    }

    async function fetchReplyCounts(commentIDs) {

        for (const replyID of commentIDs) {
            await handleReplyCount(replyID);
        }

    }

    async function handleReplyCount(replyID) {

        const query = {
            query: `
                query calcForumComments {
                calcForumComments(
                query: [{ where: { reply_to_comment_id: ${replyID} } }]
                ) {
                totalCount: countDistinct(args: [{ field: ["id"] }])
                }
                }
                `
        };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify(query)
            });

            const data = await response.json();
            const replyCount = data.data?.calcForumComments?.[0]?.totalCount || 0;



            const commentContainer = document.querySelector(`[comment-id="${replyID}"]`);

            if (commentContainer) {
                const replyCountElement = commentContainer.querySelector(`[id^="replieCountForComments"]`);

                if (replyCountElement) {
                    replyCountElement.innerHTML = `${replyCount} Replies`;
                } else {

                }
            } else {

            }




        } catch (error) {

        }
    }

    async function fetchCommentCount(postId) {
        const query = `
                query calcForumPosts($id: AwcForumPostID) {
                calcForumPosts(query: [{ where: { id: $id } }]) {
                ForumCommentsTotalCount: countDistinct(
                args: [{ field: ["ForumComments", "id"] }]
                )
                }
                }
                `;
        const variables = { id: postId };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {

                return;
            }

            const result = await response.json();

            if (result?.data?.calcForumPosts?.length > 0) {

                document.querySelector(
                    `#commentCountsForPost-${postId}`
                ).innerHTML = `${result.data.calcForumPosts[0].ForumCommentsTotalCount} Comments`;
            } else {

            }
        } catch (error) {

        }
    }

    async function processPosts(posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
            return;
        }

        for (const post of posts) {
            if (post.ID) {
                await fetchCommentCount(post.ID);
            } else {

            }
        }
    }

    let uploadedFile;
    const fileInputClassChat = document.querySelector(".formFileInputForClassChat");
    fileInputClassChat.addEventListener("change", () => {
        const postFile = fileInputClassChat.files[0];
        uploadedFile = postFile;
    });


    async function updateForumComment(newComment, commentId) {
        const graphqlMutation = `
                mutation updateForumComment($payload: ForumCommentUpdateInput = null) {
                updateForumComment(
                query: [{ where: { id: $id } }]
                payload: $payload
                ) {
                comment
                }
                }`;

        const graphqlVariables = {
            id: commentId,
            payload: {
                comment: newComment
            }
        };

        const httpRequestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": apiAccessKey
            },
            body: JSON.stringify({
                query: graphqlMutation,
                variables: graphqlVariables
            })
        };

        try {
            const httpResponse = await fetch(graphqlApiEndpoint, httpRequestOptions);
            const responseData = await httpResponse.json();

            if (responseData.errors) {

                return null;
            } else {

                return responseData.data.updateForumComment.comment;
            }
        } catch (error) {

            return null;
        }
    }

    async function updateForumPost(newPostContent, id) {
        const graphqlMutation = `
                mutation updateForumPost(
                $id: AwcForumPostID
                $payload: ForumPostUpdateInput = null
                ) {
                updateForumPost(
                query: [{ where: { id: $id } }]
                payload: $payload
                ) {
                post_copy
                }
                }

                `;

        const graphqlVariables = {
            id: id,
            payload: {
                post_copy: newPostContent
            }
        };

        const httpRequestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": apiAccessKey
            },
            body: JSON.stringify({
                query: graphqlMutation,
                variables: graphqlVariables
            })
        };

        try {
            const httpResponse = await fetch(graphqlApiEndpoint, httpRequestOptions);
            const responseData = await httpResponse.json();

            if (responseData.errors) {

                return null;
            } else {

                return responseData.data.updateForumPost.post_copy;
            }
        } catch (error) {
            return null;
        }
    }

    async function createForumPost(payload) {
        //DISCLAIMER: this creates a forum post without mentions and file attachments. Just a string.
        const mutation = `
                mutation createForumPost($payload: ForumPostCreateInput!) {
                createForumPost(payload: $payload) {
                post_copy
                author_id
                class_id
                file
                post_image
                Mentions {
                id
                }
                }
                }
                `;

        const requestBody = {
            query: mutation,
            variables: { payload }
        };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let currentPostID = Object.values(data?.extensions?.pkMap)?.[0];
            let fileURLThing = data.data.createForumPost.file;


            if (currentPostID) {
                return [currentPostID, fileURLThing];
            } else {
                throw new Error("Current Post Id was not received From the server.");
            }
        } catch (error) {

        }
    }

    async function fetchLikesForReplies(commentId) {

        const query = `
                query calcMemberCommentUpvotesForumCommentUpvotesMany($limit: IntScalar, $offset: IntScalar) {
                calcMemberCommentUpvotesForumCommentUpvotesMany(
                query: [{ where: { forum_comment_upvote_id: ${commentId} } }]
                limit: $limit
                offset: $offset
                orderBy: [
                {
                path: ["Member_Comment_Upvote_Contact_ID"]
                type: desc
                }
                ]
                ) {
                ID: field(arg: ["id"])
                Member_Comment_Upvote_ID: field(arg: ["member_comment_upvote_id"])
                Member_Comment_Upvote_Contact_ID: field(arg: ["Member_Comment_Upvote", "id"])
                }
                }
                `;

        const variables = {
            limit: 100,
            offset: 0
        };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            const result = await response.json();

            if (result.errors) {

                return;
            }

            const likesData =
                result.data.calcMemberCommentUpvotesForumCommentUpvotesMany;

            const uniqueLikes = Array.from(
                new Map(
                    likesData.map((like) => [like.Member_Comment_Upvote_Contact_ID, like])
                ).values()
            );

            const userLike = uniqueLikes.find(
                (like) =>
                    like.Member_Comment_Upvote_Contact_ID.toString() ===
                    visitorContactID
            );

            const hasUserLiked = Boolean(userLike);

            const userLikeID = hasUserLiked ? userLike.ID : null;
            return [uniqueLikes.length, hasUserLiked, userLikeID];
        } catch (error) {

        }
    }

    async function createVoteForComments(memberId, commentId) {
        const query = `
                mutation createMemberCommentUpvotesForumCommentUpvotes($payload:
                MemberCommentUpvotesForumCommentUpvotesCreateInput = null) {
                createMemberCommentUpvotesForumCommentUpvotes(payload: $payload) {
                member_comment_upvote_id
                forum_comment_upvote_id
                }
                }
                `;

        const payload = {
            member_comment_upvote_id: memberId,
            forum_comment_upvote_id: commentId
        };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({ query, variables: { payload } })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.errors) {

                return null;
            }

            return result;
        } catch (error) {

            return null;
        }
    }

    const deleteVoteCount = async (id) => {
        const query = `
                mutation deleteMemberCommentUpvotesForumCommentUpvotes(
                $id: AwcMemberCommentUpvotesForumCommentUpvotesID
                ) {
                deleteMemberCommentUpvotesForumCommentUpvotes(
                query: [{ where: { id: $id } }]
                ) {
                id
                }
                }
                `;

        const variables = {
            id
        };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {

        }
    };

    const calcMemberCommentUpvotesQuery = `
                query calcMemberCommentUpvotesForumCommentUpvotesMany($id: AwcForumCommentID) {
                calcMemberCommentUpvotesForumCommentUpvotesMany(
                query: [
                {
                where: {
                Forum_Comment_Upvote: [{ where: { id: $id } }]
                }
                }
                ]
                ) {
                ID: field(arg: ["id"])
                Member_Comment_Upvote_ID: field(arg: ["member_comment_upvote_id"])
                Forum_Comment_Upvote_ID: field(arg: ["forum_comment_upvote_id"])
                }
                }
                `;
    async function fetchCommentUpvotes(commentId) {
        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({
                    query: calcMemberCommentUpvotesQuery,
                    variables: {
                        id: commentId
                    }
                })
            });

            const result = await response.json();
            if (response.ok) {
                return result.data.calcMemberCommentUpvotesForumCommentUpvotesMany;
            } else {

                throw new Error("Failed to fetch data");
            }
        } catch (error) {

            throw error;
        }
    }

    const createReply = async (payload) => {
        const query = `
                mutation createForumComment($payload: ForumCommentCreateInput) {
                createForumComment(payload: $payload) {
                Mentions{
                id
                }
                id
                author_id
                comment
                created_at
                reply_to_comment_id
                file
                Author {
                first_name
                last_name
                profile_image
                }

                }
                }
                `;

        const variables = { payload };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            const result = await response.json();
            return result.data.createForumComment;
        } catch (error) {

        }
    };

    const mutation = `
                mutation createMemberPostUpvotesPostUpvotes(
                $payload: MemberPostUpvotesPostUpvotesCreateInput = null
                ) {
                createMemberPostUpvotesPostUpvotes(payload: $payload) {
                member_post_upvote_id
                post_upvote_id
                }
                }
                `;

    async function createVote(payload) {
        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Api-Key": apiAccessKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: mutation,
                    variables: { payload }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();

            if (result.errors) {
                throw new Error(
                    `GraphQL error: ${result.errors.map((err) => err.message).join(", ")}`
                );
            }

            const pkMapValue = result.extensions?.pkMap
                ? Object.values(result.extensions.pkMap)[0]
                : null;

            if (pkMapValue === null) {
                throw new Error("pkMap value not found in the response.");
            }

            return pkMapValue;
        } catch (error) {

            throw error;
        }
    }

    const deleteMutation = `
                mutation deleteMemberPostUpvotesPostUpvotes(
                $id: AwcMemberPostUpvotesPostUpvotesID
                ) {
                deleteMemberPostUpvotesPostUpvotes(
                query: [{ where: { id: $id } }]
                ) {
                id
                }
                }
                `;

    async function deleteVote(id) {
        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Api-Key": apiAccessKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: deleteMutation,
                    variables: { id }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.errors) {
                throw new Error(
                    `GraphQL error: ${result.errors.map((err) => err.message).join(", ")}`
                );
            }

            return result.data.deleteMemberPostUpvotesPostUpvotes.id;
        } catch (error) {

            throw error;
        }
    }


    const currentUserId = Number(visitorContactID);

    async function fetchPostUpvotes(postId) {
        const query = `
                query calcMemberPostUpvotesPostUpvotesMany($id: AwcForumPostID) {
                calcMemberPostUpvotesPostUpvotesMany(
                query: [
                { where: { Post_Upvote: [{ where: { id: $id } }] } }
                ]
                ) {
                Member_Post_Upvote_ID: field(arg: ["member_post_upvote_id"])
                Post_Upvote_ID: field(arg: ["post_upvote_id"])
                ID: field(arg: ["id"])
                }
                }
                `;
        const variables = { id: postId };

        const headers = {
            "Content-Type": "application/json",
            "Api-Key": apiAccessKey
        };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return null;
        }
    }

    function getUserUpvoteID(upvotes, userId) {
        for (let i = 0; i < upvotes.length; i++) {
            if (upvotes[i].Member_Post_Upvote_ID === userId) {
                return
                upvotes[i].ID;
            }
        } return null;
    } async function fetchAndDisplayAllUpvotes() {
        const
        posts = document.querySelectorAll(".forum-post"); for (const post of posts) {
            const
            postId = post.getAttribute("current-post-id"); if (!postId) { continue; } const data = await
                fetchPostUpvotes(postId); if (data && data.data &&
                    Array.isArray(data.data.calcMemberPostUpvotesPostUpvotesMany)) {
                        const
                        upvotes = data.data.calcMemberPostUpvotesPostUpvotesMany; const uniqueMemberIds = new Set(
                            upvotes.map((upvote) => upvote.Member_Post_Upvote_ID)
                        );
                const upvoteCount = uniqueMemberIds.size;
                post.setAttribute("updated-upVoteCount", upvoteCount);

                const voteCounter_chat = post.querySelector(".voteCounter_chat");
                if (voteCounter_chat) {
                    voteCounter_chat.textContent = upvoteCount;
                } else {

                }

                if (uniqueMemberIds.has(currentUserId)) {
                    const voteButton_chat = post.querySelector(".voteButton_chat");
                    if (voteButton_chat) {
                        voteButton_chat.classList.add("upVoted");
                        post.setAttribute("user-liked-post", "true");
                    } else {

                    }

                    const userUpvoteID = getUserUpvoteID(upvotes, currentUserId);

                    if (userUpvoteID !== null) {
                        post.setAttribute("member-upvote-id", userUpvoteID);
                    } else {

                    }
                } else {
                    const voteButton_chat = post.querySelector(".voteButton_chat");
                    if (voteButton_chat) {
                        voteButton_chat.classList.remove("upVoted");
                        post.setAttribute("user-liked-post", "false");
                    } else {

                    }

                    post.removeAttribute("member-upvote-id");
                }
            } else {

            }
        }
    }


    async function deleteForumPost(postId) {
        const mutation = `
                    mutation deleteForumPost($postId: AwcForumPostID!) {
                    deleteForumPost(query: [{ where: { id: $postId } }]) {
                    id
                    }
                    }
                    `;

        const variables = { postId };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Api-Key": apiAccessKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: mutation, variables })
            });

            const json = await response.json();
            return json;

            if (json.errors) {

                return null;
            }

            return json.data.deleteForumPost;
        } catch (error) {

            return null;
        }
    }


    async function postComment(postId, authorId, commentText, mentionIDs, file) {
        const addCommentMutationQuery = `
                    mutation createForumComment($payload: ForumCommentCreateInput!) {
                    createForumComment(payload: $payload) {
                    Mentions {
                    id
                    }
                    author_id
                    comment
                    forum_post_id
                    Author {
                    first_name
                    last_name
                    profile_image
                    }
                    file
                    }
                    }
                    `;

        // Build the payload with required fields.
        const payload = {
            forum_post_id: postId,
            author_id: authorId,
            comment: commentText,
            Mentions: mentionIDs.length > 0 ? mentionIDs : [],
        };

        // Include the file if provided.
        if (file) {
            payload.file = file;
        }

        const requestBodyForComment = {
            query: addCommentMutationQuery,
            variables: {
                payload
            }
        };

        try {
            const responseFromComment = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify(requestBodyForComment)
            });

            if (!responseFromComment.ok) {
                throw new Error(`GraphQL HTTP error! Status: ${responseFromComment.status}`);
            }

            const responseJson = await responseFromComment.json();

            if (responseJson.data && responseJson.data.createForumComment) {
                return responseJson;
            } else {

            }
        } catch (error) {

            alert(`Error submitting comment: ${error.message}`);
        }
    }



    async function deleteForumComment(commentId) {
        if (!commentId || typeof commentId !== "string") {

            return null;
        }

        const mutation = `
                    mutation deleteForumComment($id: AwcForumCommentID!) {
                    deleteForumComment(query: [{ where: { id: $id } }]) {
                    id
                    }
                    }
                    `;

        const variables = { id: commentId };

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Api-Key": apiAccessKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: mutation, variables })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();

            if (json.errors) {

                return null;
            }

            const deleted = json.data.deleteForumComment;



            if (deleted && deleted.id) {


                return deleted;
            }

            return null;
        } catch (error) {

            return null;
        }
    }




    function createPostsFetcher() {
        let limit = 3, offset = 0;
        let loadingThePosts = false;
        let lastFetchedTime = 0;
        const cooldownTime = 500;
        return async function fetchForumPosts() {
            const now = Date.now();
            if (loadingThePosts || now - lastFetchedTime < cooldownTime) { return []; } loadingThePosts = true;
            lastFetchedTime = now; const graphqlQuery = ` query calcForumPosts($class_id: AwcClassID, $limit:
                        IntScalar, $offset: IntScalar) { calcForumPosts( query: [{ where: { class_id: $class_id } }]
                        limit: $limit offset: $offset orderBy: [{ path: ["created_at"], type: desc }] ) {
                        Author_Profile_Image: field(arg: ["Author", "profile_image" ]) Author_Display_Name: field(arg:
                        ["Author", "display_name" ]) Author_Last_Name: field(arg: ["Author", "last_name" ])
                        Author_First_Name: field(arg: ["Author", "first_name" ]) Date_Added: field(arg: ["created_at"])
                        Post_Copy: field(arg: ["post_copy"]) Post_Image: field(arg: ["post_image"]) Author_ID:
                        field(arg: ["author_id"]) File: field(arg: ["file"]) ID: field(arg: ["id"]) ClassID: field(arg:
                        ["Class", "id" ]) Author_Is_Instructor: field(arg: ["Author", "is_instructor" ])
                        ForumCommentsTotalCount: countDistinct(args: [{ field: ["ForumComments", "id" ] }])
                        Author_Is_Admin: field(arg: ["Author", "is_admin" ]) } }`; const variables = {
                class_id:
                    Number(currentClassID), limit: limit, offset: offset
            }; const httpRequestOptions = {
                method: "POST", headers: { "Content-Type": "application/json", "Api-Key": apiAccessKey },
                body: JSON.stringify({ query: graphqlQuery, variables: variables })
            }; try {
                const
                httpResponse = await fetch(graphqlApiEndpoint, httpRequestOptions); const responseData = await
                    httpResponse.json(); if (responseData.errors) {
                        console.error("GraphQL Errors
                            (fetchForumPosts): ", responseData.errors); return []; } else { offset +=limit; return
                        responseData.data.calcForumPosts || [];
                    }
            } catch (error) {
                console.error("Error while fetching
                        forum posts: ", error); return []; } finally { setTimeout(()=> {
                        loadingThePosts = false;
            }, cooldownTime);
        }
    };
                        }


    function renderForumPosts(posts) {
        const forumContainer = document.getElementById("parentAllAnnouncements");
        if (!forumContainer) {

            return;
        }

        // forumContainer.innerHTML = "";
        posts.forEach((post, index) => {
            const postDate = post.Date_Added
                ? new Date(post.Date_Added * 1000).toLocaleString()
                : "N/A";

            const profileImage = post.Author_Profile_Image || "";
            //const authorFullName = post.Author_Display_Name || "Anoynomous";
            const authorFullName = post.Author_Display_Name || ((post.Author_First_Name ||
                post.Author_Last_Name) ? `${post.Author_First_Name ?? ''} ${post.Author_Last_Name ?? ''}`.trim()
                : "Anonymous");
            const postContent = post.Post_Copy || "N/A";
            const authorId = post.Author_ID;
            const actualPostID = post.ID;
            const postFile = post.File;
            const isTeacher = post.Author_Is_Instructor;
            const ForumCommentsTotalCount = post.ForumCommentsTotalCount;
            const isAuthorAnAdmin = post.Author_Is_Admin;

            const embeedableUrls = extractAndConvertToEmbedUrls(postContent);

            // Declare and initialize postHTML properly before using it
            const postHTML = templateForForumPost(
                profileImage,
                authorFullName,
                postDate,
                embeedableUrls.formattedPostText,
                authorId,
                actualPostID,
                postFile,
                isTeacher,
                ForumCommentsTotalCount,
                isAuthorAnAdmin
            );

            // Check if postHTML is valid
            if (!postHTML) {

                return;
            }

            const postWrapper = document.createElement("div");
            postWrapper.innerHTML = postHTML;

            // Handling embedded URLs
            if (embeedableUrls.embeddableUrls.length > 0) {
                let randomNumber = Math.floor(Math.random() * embeedableUrls.embeddableUrls.length);
                let iframe = postWrapper.firstElementChild.querySelector("iframe");
                if (iframe) {
                    iframe.src = embeedableUrls.embeddableUrls[randomNumber];
                    iframe.classList.remove("hidden");
                }
            }

            forumContainer.appendChild(postWrapper.firstElementChild);
        });
    }



    async function getCommentsByPostId(postId) {
        const query = `
                        query calcForumComments($postId: AwcForumPostID) {
                        calcForumComments(
                        query: [
                        {
                        where: {
                        Forum_Post: [
                        { where: { id: $postId } }
                        ]
                        }
                        }
                        ]
                        ) {
                        File: field(arg: ["file"])
                        Author_ID: field(arg: ["author_id"])
                        Author_Display_Name: field(arg: ["Author", "display_name"])
                        Author_Last_Name: field(arg: ["Author", "last_name"])
                        Author_First_Name: field(arg: ["Author", "first_name"])
                        Author_Profile_Image: field(arg: ["Author", "profile_image"])
                        Date_Added: field(arg: ["created_at"])
                        Comment: field(arg: ["comment"])
                        ID: field(arg: ["id"])
                        Author_Is_Instructor: field(
                        arg: ["Author", "is_instructor"]
                        )
                        ForumCommentsTotalCount: countDistinct(
                        args: [{ field: ["ForumComments", "id"] }]
                        )
                        Author_Is_Admin: field(arg: ["Author", "is_admin"])
                        File: field(arg: ["file"])



                        }
                        }
                        `;

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Api-Key": apiAccessKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query,
                    variables: { postId }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            return result.data?.calcForumComments || [];
        } catch (error) {

            return [];
        }
    }

    // Function to fetch upvotes for each reply
    async function fetchUpVotesForReplies(replies) {
        const promises = replies.map(async (reply) => {
            try {
                const likesData = await fetchLikesForReplies(reply.ID);
                return likesData;
            } catch (error) {

                return [0, false, null];
            }
        });
        return Promise.all(promises);
    }

    // Function to process and render replies for a given commentId
    async function renderRepliesForComment(commentId) {
        try {
            const replyShowContainer = document
                .querySelector(`[comment-id="${commentId}"]`)
                .querySelector(".replyShowContainer");
            if (!replyShowContainer) {
                return;
            } else {

            }

            let replies = await fetchRepliesByCommentId(commentId);

            if (Array.isArray(replies) && replies.length > 0) {

                const likesData = await fetchUpVotesForReplies(replies);

                $.views.helpers({
                    elapsedTime: convertToElapsedTime
                });
                const replyTmpl = $.templates("#replyTemplate");
                const replyHTML = replyTmpl.render(replies);
                replyShowContainer.innerHTML = replyHTML;


                const allReplies = Array.from(replyShowContainer.children);
                for (let i = 0; i < allReplies.length; i++) {
                    const replyElement = allReplies[i]; // Set an
                            attribute based on whether the user liked the reply if (likesData[i][1] === false) {
                        replyElement.setAttribute("user-liked-reply", "false");
                    } else {
                        replyElement.setAttribute("user-liked-reply", "true");
                        replyElement.querySelector("button").classList.add("upVoted");
                        replyElement.setAttribute("user-liked-id", likesData[i][2]);
                    } // Update the vote counter
                    with the number of unique likes const
                        currentVoteBtn = replyElement.querySelector(".voteCounter_chat");
                    currentVoteBtn.innerHTML = likesData[i][0];
                }
            }
        } catch (error) { }
    } async function
        renderCommentsForPost(postId) {
            const
            postElement = document.querySelector(`[current-post-id="${postId}" ]`); if (!postElement) {
                return;
            } // Fetch comments for the post const comments=await getCommentsByPostId(postId);
        if (!Array.isArray(comments)) { return; } const
            commentContainer = postElement.querySelector("#allCommentsForPostContainer"); if
            (!commentContainer) { return; } commentContainer.innerHTML = ""; $.views.helpers({
                elapsedTime: convertToElapsedTime, filePreview: function (file) {
                    if (file) {
                        var
                        analyzedObject = analyzeFile(file); return generateFilePreview(analyzedObject);
                    } return "";
                }
            }); const commentTmpl = $.templates("#commentTemplate"); const
                commentHTML = commentTmpl.render(comments); commentContainer.innerHTML = commentHTML; // Process
                            upvotes for each comment const commentIDs = comments.map((c) => c.ID).filter(Boolean);

        // fetchReplyCounts(commentIDs);

        for (const commentId of commentIDs) {
            try {
                const upvoteData = await fetchCommentUpvotes(commentId);
                const visitorIdNum = Number(contactIdOfThisVisitor);
                function getUpvoteId() {
                    for (const upvote of upvoteData) {
                        if (upvote.Member_Comment_Upvote_ID === visitorIdNum) {
                            return upvote.ID;
                        }
                    }
                    return null;
                }
                const uniqueMemberIds = new Set(
                    (upvoteData || []).map((item) => item.Member_Comment_Upvote_ID)
                );
                const upvoteCount = uniqueMemberIds.size;
                const hasUserUpvoted = uniqueMemberIds.has(visitorIdNum);

                const specificCommentContainer = commentContainer.querySelector(
                    `[comment-id="${commentId}"]`
                );
                if (!specificCommentContainer) {

                    continue;
                }

                specificCommentContainer.setAttribute(
                    "user-liked-comment",
                    hasUserUpvoted ? "true" : "false"
                );
                if (hasUserUpvoted) {
                    const theUpvoteId = getUpvoteId();
                    if (theUpvoteId) {
                        specificCommentContainer.setAttribute("user-upvote-id", theUpvoteId);
                    }
                }

                const voteButton_chatEl = specificCommentContainer.querySelector(
                    `button.voteButton_chat[id="vote-${commentId}"]`
                );
                if (voteButton_chatEl) {
                    voteButton_chatEl.classList.toggle("upVoted", hasUserUpvoted);
                    const voteCounter_chatEl = voteButton_chatEl.querySelector(".voteCounter_chat");
                    if (voteCounter_chatEl) {
                        voteCounter_chatEl.textContent = upvoteCount;
                    }
                }
            } catch (err) {

            }
        }

    }



    async function fetchRepliesByCommentId(reply_to_comment_id) {
        const query = `
                            query calcForumComments($reply_to_comment_id: AwcForumCommentID) {
                            calcForumComments(
                            query: [
                            {
                            where: { reply_to_comment_id: $reply_to_comment_id }
                            }
                            ]
                            ) {
                            File: field(arg: ["file"])
                            ID: field(arg: ["id"])
                            Author_ID: field(arg: ["author_id"])
                            Author_Display_Name: field(
                            arg: ["Author", "display_name"]
                            )
                            Author_Last_Name: field(arg: ["Author", "last_name"])
                            Author_First_Name: field(arg: ["Author", "first_name"])
                            Author_Profile_Image: field(arg: ["Author", "profile_image"])
                            Comment: field(arg: ["comment"])
                            Date_Added: field(arg: ["created_at"])
                            Reply_to_Comment_ID: field(arg: ["reply_to_comment_id"])
                            Author_Is_Instructor: field(
                            arg: ["Author", "is_instructor"]
                            )
                            Author_Is_Admin: field(arg: ["Author", "is_admin"])

                            }
                            }
                            `;

        try {
            const response = await fetch(graphqlApiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": apiAccessKey
                },
                body: JSON.stringify({
                    query,
                    variables: { reply_to_comment_id }
                })
            });

            const data = await response.json();

            if (data.errors) {

                return;
            }

            const comments = data.data.calcForumComments || [];

            if (!comments.length) {
                return;
            }

            return comments;
        } catch (error) {

        }
    }




    async function attachAllListenerFns() {
        function resetAllUI() {
            document.querySelectorAll(".optionsContainerPosts").forEach((el) => {
                el.classList.add("opacity-0", "pointer-events-none");
                el.classList.remove("opacity-100", "pointer-events-auto");
            });
            document.querySelectorAll(".optionsContainerComments").forEach((el) => {
                el.classList.add("opacity-0", "pointer-events-none");
                el.classList.remove("opacity-100", "pointer-events-auto");
            });
            document.querySelectorAll(".optionsContainerReplies").forEach((el) => {
                el.classList.add("opacity-0", "pointer-events-none");
                el.classList.remove("opacity-100", "pointer-events-auto");
            });
        }
        document.addEventListener("focusin", (e) => {
            const m = e.target.closest(".mentionable");
            if (m && !m.dataset.tributeAttached && globalTribute) {
                globalTribute.attach(m);
                m.dataset.tributeAttached = "true";
            }
        });

        document.addEventListener("click", async (e) => {
            e.stopPropagation();
            resetAllUI();

            const editBtn = e.target.closest(".edit-post-btn");
            if (editBtn) {
                // Get the closest parent container that might have the ID attributes
                const container = editBtn.closest(
                    "[current-post-id], [comment-id], [reply-id]"
                );
                if (!container) return;

                // Determine type based on which attribute exists
                let editType = null;
                if (container.hasAttribute("current-post-id")) {
                    editType = "post";
                } else if (container.hasAttribute("comment-id")) {
                    editType = "comment";
                } else if (container.hasAttribute("reply-id")) {
                    editType = "reply";
                }

                // Extract data based on the determined type
                let id, authorId, currentText;
                switch (editType) {
                    case "post":
                        id = container.getAttribute("current-post-id");
                        break;
                    case "comment":
                        id = container.getAttribute("comment-id");
                        break;
                    case "reply":
                        id = container.getAttribute("reply-id");
                        break;
                }

                authorId = container.getAttribute("author-id");
                currentText =
                    container.querySelector(".text-bodyText")?.innerHTML.trim() || "";



                // Update modal
                const modalEl = document.getElementById("editModal");
                modalEl.dataset.editType = editType;
                modalEl.dataset.editId = id;
                modalEl.dataset.authorId = authorId;
                modalEl.querySelector(".comment-editor").innerHTML = currentText;

                return;
            }

            const updateButton = e.target.closest("#updateNowButton");
            if (updateButton) {
                const modalEl = document.getElementById("editModal");

                // Retrieve dataset info (populated when .edit-post-btn is clicked)
                const editType = modalEl.dataset.editType;
                const editId = modalEl.dataset.editId;
                const authorId = modalEl.dataset.authorId;

                const updatedText =
                    modalEl.querySelector(".comment-editor")?.innerHTML.trim() || "";


                if (editType === "post") {

                    const result = await updateForumPost(updatedText, editId);

                    if (result !== null) {
                        modalEl.querySelector(".comment-editor").innerHTML = result;
                        document.querySelector(
                            `[current-post-id="${editId}"] .text-bodyText`
                        ).innerHTML = result;
                    } else {

                    }


                } else if (editType === "comment") {


                    const result = await updateForumComment(updatedText, editId);

                    if (result !== null) {
                        //
                        document.querySelector(
                            `[comment-id="${editId}"] .text-bodyText`
                        ).innerHTML = String(result);

                    }
                } else if (editType === "reply") {

                    // TODO: reply to the comment and commments are typically the same things. . .
                    const result = await updateForumComment(updatedText, editId);

                    if (result !== null) {
                        //
                        document.querySelector(
                            `[reply-id="${editId}"] .text-bodyText`
                        ).innerHTML = String(result);

                    }
                }
            }



            const postButton = e.target.closest("#postNowButtonForForumPost");
            if (postButton) {
                postButton
                    .closest("#postOuterWrapper")
                    .classList.add("opacity-50", "pointer-events-none");


                let fileData = null;
                const fileFields = [];
                if (uploadedFile) {
                    fileFields.push({
                        fieldName: "file_content",
                        file: uploadedFile
                    });
                }

                if (fileFields.length > 0) {
                    const toSubmitFields = {};
                    await processFileFields(
                        toSubmitFields,
                        fileFields,
                        awsParam,
                        awsParamUrl
                    );
                    fileData =
                        typeof toSubmitFields.file_content === "string"
                            ? JSON.parse(toSubmitFields.file_content)
                            : toSubmitFields.file_content;
                    fileData.name = fileData.name || uploadedFile.name;
                    fileData.size = fileData.size || uploadedFile.size;
                    fileData.type = fileData.type || uploadedFile.type;
                }

                const textArea = postButton
                    .closest("#postOuterWrapper")
                    .querySelector(".mentionable");
                const postText = textArea.innerHTML.trim();
                const mentionIDs = gatherMentionsFromElement(textArea);
                textArea.innerHTML = "";
                textArea.removeAttribute("data-tributeAttached");
                const parentAllAnnouncements =
                    postButton.closest("#postOuterWrapper").nextElementSibling;
                const newDiv = document.createElement("div");
                const embeedableUrls = extractAndConvertToEmbedUrls(postText);


                if (uploadedFile != undefined) {
                    const awsFileObject = {
                        link: "https://courses.writerscentre.com.au",
                        name: uploadedFile.name,
                        size: uploadedFile.size,
                        type: uploadedFile.type,
                        s3_id: "dummy_s3_id_" + uploadedFile.name
                    };
                    const awsFileString = JSON.stringify(awsFileObject);

                    newDiv.innerHTML = templateForForumPost(
                        visitorProfilePicture,
                        visitorFirstName,
                        visitorLastName,
                        "Just Now",
                        embeedableUrls.formattedPostText,
                        Number(visitorContactID),
                        "id",
                        awsFileString,
                        iscontactInstructor === "Yes" ? true : false,
                        0,
                        isContactAdmin === "No" ? false : true,

                    );
                } else {


                    newDiv.innerHTML = templateForForumPost(
                        visitorProfilePicture,
                        contactDisplayName,
                        "Just Now",
                        embeedableUrls.formattedPostText,
                        Number(visitorContactID),
                        "null",
                        null,
                        iscontactInstructor === "Yes" ? true : false,
                        0,
                        isContactAdmin === "No" ? false : true,

                    );
                }

                const toBeAddedUpTemplate = newDiv.firstElementChild;
                toBeAddedUpTemplate.classList.add("opacity-50", "pointer-events-none");


                if (embeedableUrls.embeddableUrls.length > 0) {
                    //
                    let randomNumber = Math.floor(Math.random() * embeedableUrls.embeddableUrls.length);
                    newDiv.firstElementChild.querySelector("iframe").src =
                        embeedableUrls.embeddableUrls[randomNumber];
                    newDiv.firstElementChild.querySelector("iframe").classList.remove("hidden");

                }


                parentAllAnnouncements.prepend(toBeAddedUpTemplate);

                const result = await createForumPost({
                    post_copy: postText,
                    author_id: Number(contactIdOfThisVisitor),
                    class_id: currentClassID,
                    file: fileData ? fileData : null,
                    Mentions: mentionIDs.map((id) => ({ id: Number(id) }))
                });
                if (result) {
                    document.getElementById("showContainerForAllFiles").innerHTML = "";
                    document.getElementById("replaceFileContainer").classList.add("hidden");
                    document.getElementById("deleteFileContainer").classList.add("hidden");
                    document.querySelector(".attachAFileForClassChat").classList.remove("hidden");

                    uploadedFile = undefined;
                    postButton
                        .closest("#postOuterWrapper")
                        .classList.remove("opacity-50", "pointer-events-none");

                    toBeAddedUpTemplate.classList.remove(
                        "opacity-50",
                        "pointer-events-none"
                    );
                    toBeAddedUpTemplate.setAttribute("current-post-id", result[0]);
                    toBeAddedUpTemplate.setAttribute("user-liked-post", false);
                    toBeAddedUpTemplate.setAttribute("author-id", visitorContactID);


                    // Find the element within `toBeAddedUpTemplate` that has an ID starting with
                    "commentCountsForPost-"
                    let currentIdOfTheTemplate =
                        toBeAddedUpTemplate.querySelector('[id^="commentCountsForPost-"]');

                    if (currentIdOfTheTemplate && result.length > 0) {
                        // Update the ID of the found element
                        currentIdOfTheTemplate.id = `commentCountsForPost-${result[0]}`;
                    }



                    const anchorTagOfTheTemplate = toBeAddedUpTemplate.querySelector("a");
                    const videoTagOfTheTemplate =
                        toBeAddedUpTemplate.querySelector("video");
                    const imageTagOfTheTemplate =
                        toBeAddedUpTemplate.querySelector(".post-image");
                    const audioTagOfTemplate = toBeAddedUpTemplate.querySelector("audio");

                    function extractUrl(text) {
                        const urlMatch = text.match(/(https?:\/\/[^\s"]+)/);

                        if (urlMatch) {
                            return urlMatch[1].replace(/\\+$/, "");
                        } else {
                            return "No URL found in the text";
                        }
                    }

                    if (anchorTagOfTheTemplate) {
                        let usableLink = extractUrl(result[1]);

                        anchorTagOfTheTemplate.href = `${usableLink}`;
                    } else if (imageTagOfTheTemplate) {
                        let usableLink = extractUrl(result[1]);
                        imageTagOfTheTemplate.src = `${usableLink}`;
                    } else if (videoTagOfTheTemplate) {
                        let usableLink = extractUrl(result[1]);
                        const videoSource = videoTagOfTheTemplate;
                        videoSource.setAttribute("src", usableLink);
                    }

                    else if (audioTagOfTemplate) {
                        let usableLink = extractUrl(result[1]);
                        audioTagOfTemplate.src = usableLink;


                    }
                    else {

                    }
                } else {
                    postButton
                        .closest("#postOuterWrapper")
                        .classList.remove("opacity-50", "pointer-events-none");
                    toBeAddedUpTemplate.remove();
                }
                return;
            }

            const voteButton_chat = e.target.closest(".voteButton_chat");
            if (voteButton_chat) {
                e.stopPropagation();
                const replyContainer = voteButton_chat.closest("[reply-id]");
                const commentContainer = voteButton_chat.closest("[comment-id]");
                const forumPost = voteButton_chat.closest(".forum-post");
                if (replyContainer) {
                    const userLikedReply =
                        replyContainer.getAttribute("user-liked-reply") === "true";
                    //true or false in string
                    const userUpvoteId = replyContainer.getAttribute("user-liked-id");
                    //either undefined or number in string.
                    const voteCounter_chatEl = voteButton_chat.querySelector(".voteCounter_chat");
                    let currentVotes = parseInt(voteCounter_chatEl?.textContent || "0", 10);
                    if (userLikedReply) {
                        if (!userUpvoteId) return;
                        voteButton_chat.classList.add("opacity-50", "pointer-events-none");
                        try {
                            const deletionResult = await deleteVoteCount(userUpvoteId);
                            if (
                                deletionResult?.data
                                    ?.deleteMemberCommentUpvotesForumCommentUpvotes
                            ) {
                                replyContainer.setAttribute("user-liked-reply", "false");
                                replyContainer.removeAttribute("user-liked-id");
                                voteButton_chat.classList.remove("upVoted");
                                currentVotes = Math.max(currentVotes - 1, 0);
                                voteCounter_chatEl.textContent = currentVotes;
                            } else {
                                throw new Error();
                            }
                        } catch (err) {
                            alert("Failed to remove your reply upvote.");
                        } finally {
                            voteButton_chat.classList.remove("opacity-50", "pointer-events-none");
                        }
                    } else {
                        const replyId = replyContainer.getAttribute("reply-id");
                        if (!replyId) return;
                        const parentPost = replyContainer.closest(".forum-post");
                        const authorId = Number(parentPost.getAttribute("author-id"));
                        voteButton_chat.classList.add("opacity-50", "pointer-events-none");
                        try {
                            const createResult = await createVoteForComments(authorId, replyId);
                            if (
                                createResult?.data?.createMemberCommentUpvotesForumCommentUpvotes
                            ) {
                                const newUpvoteId = Object.values(
                                    createResult.extensions.pkMap
                                )[0];
                                replyContainer.setAttribute("user-liked-reply", "true");
                                replyContainer.setAttribute("user-liked-id", newUpvoteId);
                                voteButton_chat.classList.add("upVoted");
                                currentVotes += 1;
                                voteCounter_chatEl.textContent = currentVotes;
                            } else {
                                throw new Error();
                            }
                        } catch (err) {
                            alert("Failed to upvote the reply.");
                        } finally {
                            voteButton_chat.classList.remove("opacity-50", "pointer-events-none");
                        }
                    }
                    return;
                }
                if (commentContainer) {
                    const userLikedComment =
                        commentContainer.getAttribute("user-liked-comment") === "true";
                    let userUpvoteId = commentContainer.getAttribute("user-upvote-id");
                    const voteCounter_chatEl = voteButton_chat.querySelector(".voteCounter_chat");
                    let currentVotes = parseInt(voteCounter_chatEl?.textContent || "0", 10);
                    if (userLikedComment) {
                        if (!userUpvoteId) return;
                        voteButton_chat.classList.add("opacity-50", "pointer-events-none");
                        try {
                            const deletionResult = await deleteVoteCount(userUpvoteId);
                            if (
                                deletionResult?.data
                                    ?.deleteMemberCommentUpvotesForumCommentUpvotes
                            ) {
                                commentContainer.setAttribute("user-liked-comment", "false");
                                commentContainer.removeAttribute("user-upvote-id");
                                voteButton_chat.classList.remove("upVoted");
                                currentVotes = Math.max(currentVotes - 1, 0);
                                voteCounter_chatEl.textContent = currentVotes;
                            } else {
                                throw new Error();
                            }
                        } catch (err) {
                            alert("Failed to remove your comment upvote.");
                        } finally {
                            voteButton_chat.classList.remove("opacity-50", "pointer-events-none");
                        }
                    } else {
                        const commentId = commentContainer.getAttribute("comment-id");
                        if (!commentId) return;
                        voteButton_chat.classList.add("opacity-50", "pointer-events-none");
                        try {
                            const memberId = Number(contactIdOfThisVisitor);
                            const createResult = await createVoteForComments(
                                memberId,
                                commentId
                            );
                            if (
                                createResult?.data?.createMemberCommentUpvotesForumCommentUpvotes
                            ) {
                                const newUpvoteId = Object.values(
                                    createResult.extensions.pkMap
                                )[0];
                                commentContainer.setAttribute("user-liked-comment", "true");
                                commentContainer.setAttribute("user-upvote-id", newUpvoteId);
                                voteButton_chat.classList.add("upVoted");
                                currentVotes += 1;
                                voteCounter_chatEl.textContent = currentVotes;
                            } else {
                                throw new Error();
                            }
                        } catch (err) {
                            alert("Failed to upvote the comment.");
                        } finally {
                            voteButton_chat.classList.remove("opacity-50", "pointer-events-none");
                        }
                    }
                    return;
                }
                if (!forumPost) return;
                const userLikedPost =
                    forumPost.getAttribute("user-liked-post") === "true";
                let memberUpvoteId = forumPost.getAttribute("member-upvote-id");
                if (userLikedPost && !memberUpvoteId) return;
                const voteCounter_chat = voteButton_chat.querySelector(".voteCounter_chat");
                let currentVotes = parseInt(voteCounter_chat.textContent, 10) || 0;
                if (userLikedPost) {
                    voteButton_chat.classList.add("opacity-50", "pointer-events-none");
                    try {
                        const deletionResult = await deleteVote(memberUpvoteId);
                        if (deletionResult) {
                            forumPost.setAttribute("user-liked-post", "false");
                            forumPost.removeAttribute("member-upvote-id");
                            voteButton_chat.classList.remove("upVoted");
                            currentVotes = Math.max(currentVotes - 1, 0);
                            voteCounter_chat.textContent = currentVotes;
                        } else {
                            throw new Error();
                        }
                    } catch (err) {
                        alert("Failed to remove your upvote.");
                    } finally {
                        voteButton_chat.classList.remove("opacity-50", "pointer-events-none");
                    }
                } else {
                    const postId = Number(forumPost.getAttribute("current-post-id"));
                    const currentUserId = Number(visitorContactID);
                    if (!postId) return;
                    voteButton_chat.classList.add("opacity-50", "pointer-events-none");
                    try {
                        const voteResponse = await createVote({
                            post_upvote_id: postId,
                            member_post_upvote_id: currentUserId
                        });
                        if (voteResponse) {
                            const newVoteId = voteResponse;
                            forumPost.setAttribute("user-liked-post", "true");
                            forumPost.setAttribute("member-upvote-id", newVoteId);
                            voteButton_chat.classList.add("upVoted");
                            currentVotes += 1;
                            voteCounter_chat.textContent = currentVotes;
                        } else {
                            throw new Error();
                        }
                    } catch (err) {
                        alert("Failed to upvote.");
                    } finally {
                        voteButton_chat.classList.remove("opacity-50", "pointer-events-none");
                    }
                }
                return;
            }
            const tripleDot = e.target.closest(".tripleDotSVG");
            if (tripleDot) {
                if (tripleDot.closest("[reply-id]")) {
                    const replyContainer = tripleDot.closest("[reply-id]");
                    const optionsContainer = replyContainer.querySelector(
                        ".optionsContainerReplies"
                    );
                    if (optionsContainer) {
                        optionsContainer.classList.remove("opacity-0", "pointer-events-none");
                        optionsContainer.classList.add("opacity-100", "pointer-events-auto");
                    }
                    return;
                }
                if (tripleDot.closest("[comment-id]")) {
                    const commentContainer = tripleDot.closest("[comment-id]");
                    const optionsContainer = commentContainer.querySelector(
                        ".optionsContainerComments"
                    );
                    if (optionsContainer) {
                        optionsContainer.classList.remove("opacity-0", "pointer-events-none");
                        optionsContainer.classList.add("opacity-100", "pointer-events-auto");
                    }
                    return;
                }
                if (tripleDot.closest(".forum-post")) {
                    const postContainer = tripleDot.closest(".forum-post");
                    const optionsContainer = postContainer.querySelector(
                        ".optionsContainerPosts"
                    );
                    if (optionsContainer) {
                        optionsContainer.classList.remove("opacity-0", "pointer-events-none");
                        optionsContainer.classList.add("opacity-100", "pointer-events-auto");
                    }
                    return;
                }
            }

            const deleteBtn = e.target.closest(".delete-post-btn");
            if (deleteBtn) {
                const replyEl = deleteBtn.closest("[reply-id]");
                if (replyEl) {
                    const replyId = replyEl.getAttribute("reply-id");
                    replyEl.style.opacity = "0.5";
                    replyEl.style.pointerEvents = "none";
                    try {
                        const del = await deleteForumComment(replyId);
                        if (del) replyEl.remove();

                        else throw new Error();
                    } catch (err) {
                        replyEl.style.opacity = "1";
                        replyEl.style.pointerEvents = "auto";
                        alert("Failed to delete the comment.");
                    }
                    return;
                }

                const commentEl = deleteBtn.closest("[comment-id]");
                if (commentEl) {
                    const commentId = commentEl.getAttribute("comment-id");
                    commentEl.style.opacity = "0.5";
                    commentEl.style.pointerEvents = "none";
                    try {
                        const del = await deleteForumComment(commentId);
                        handleCommentCounts(commentEl);

                        if (del) {
                            commentEl.remove();

                        }


                        else throw new Error();
                    } catch (err) {
                        commentEl.style.opacity = "1";
                        commentEl.style.pointerEvents = "auto";
                        alert("Failed to delete the comment.");
                    }
                    return;
                }
                const postEl = deleteBtn.closest(".forum-post");
                if (postEl) {
                    const postId = postEl.getAttribute("current-post-id");
                    postEl.classList.add("opacity-50", "pointer-events-none");
                    try {
                        const deletionResult = await deleteForumPost(postId);
                        if (deletionResult) postEl.remove();
                        else throw new Error();
                    } catch (err) {
                        postEl.classList.remove("opacity-50", "pointer-events-none");
                        alert("Failed to delete the post.");
                    }
                    return;
                }
                return;
            }


        });

    }

    const postClosureInstance = createPostsFetcher();

    async function fetchAndDisplayForumPosts() {

        const posts = await postClosureInstance();
        loadingThePosts = false;

        renderForumPosts(posts);
        fetchAndDisplayAllUpvotes();

    }






    document.addEventListener('DOMContentLoaded', () => {
        attachAllListenerFns();
        const footerElement = document.getElementById('footerOfClassChat');
        loadingThePosts = false;

        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (loadingThePosts === false) {
                        fetchAndDisplayForumPosts(loadingThePosts);
                    }

                    else {
                    }


                }
            });
        };

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(handleIntersection, options);



        if (footerElement) {
            observer.observe(footerElement);
        } else {
            const documentObserver = new MutationObserver(() => {
                const element = document.getElementById('footerOfClassChat');
                if (element) {
                    observer.observe(element);
                    documentObserver.disconnect();
                }
            });

            documentObserver.observe(document.body, { childList: true, subtree: true });
        }
    });



    let authorID = LOGGED_IN_USER_ID;

    document.addEventListener("DOMContentLoaded", () => {
        const parentAllAnnouncements = document.querySelector("#parentAllAnnouncements");
        const container = document.getElementById("allAnnouncementsContainer");
        const children = container.querySelectorAll(".text-button");

        container.addEventListener("click", (event) => {
            const target = event.target;

            if (target !== container && target.classList.contains("text-button")) {
                children.forEach((child) => {
                    child.classList.remove("border-b-[#007c8f]");
                    child.classList.add("border-transparent");
                });

                target.classList.remove("border-transparent");
                target.classList.add("border-b-[#007c8f]");

                const index = Array.from(children).indexOf(target);

                const posts = parentAllAnnouncements.children;

                Array.from(posts).forEach((post) => {
                    const authorPostId = post.getAttribute("author-ID");

                    if (index === 0) {
                        post.classList.remove("hidden");
                    } else if (index === 1) {
                        if (authorPostId === authorID) {
                            post.classList.remove("hidden");
                        } else {
                            post.classList.add("hidden");
                        }
                    }
                });
            }
        });
    });






    function analyzeFile(fileData) {
        try {
            let result = {
                fileType: null,
                category: 'unknown',
                fileLink: null,
                fileName: null
            };
            let fileObject;

            // Handle input
            if (typeof fileData === 'string') {
                if (fileData.startsWith('http')) {
                    fileObject = { link: fileData };
                } else {
                    try {
                        fileObject = JSON.parse(fileData);
                    } catch (e) {
                        fileObject = { name: fileData };
                    }
                }
            } else if (typeof fileData === 'object') {
                fileObject = fileData;
            } else {
                throw new Error('Invalid input type');
            }

            // Assign link and name
            if (fileObject.link) {
                result.fileLink = fileObject.link;
            }
            if (fileObject.name) {
                result.fileName = fileObject.name;
            }

            // Extract file extension from link or name
            function getFileExtension(str) {
                if (!str) return null;
                try {
                    const decodedStr = decodeURIComponent(str);
                    // Look for the last occurrence of a file extension before query params
                    const match = decodedStr.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/i);
                    if (match) return match[1].toLowerCase();

                    // Fallback: search anywhere in the string for a known extension
                    const knownExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'mp4', 'mp3'];
                    for (const ext of knownExtensions) {
                        if (decodedStr.toLowerCase().includes(`.${ext}`)) return ext;
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            }
            const mimeTypeMap = {
                'image/jpeg': { type: 'jpg', category: 'image' },
                'image/png': { type: 'png', category: 'image' },
                'image/gif': { type: 'gif', category: 'image' },
                'image/webp': { type: 'webp', category: 'image' },
                'application/pdf': { type: 'pdf', category: 'document' },
                'video/mp4': { type: 'mp4', category: 'video' },
                'audio/mpeg': { type: 'mp3', category: 'audio' }
            };

            if (fileObject.type && mimeTypeMap[fileObject.type]) {
                result.fileType = mimeTypeMap[fileObject.type].type;
                result.category = mimeTypeMap[fileObject.type].category;
            } else {
                const extension = getFileExtension(result.fileLink) || getFileExtension(result.fileName);
                if (extension) {
                    const extensionCategories = {
                        'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'webp': 'image',
                        'pdf': 'document', 'doc': 'document', 'docx': 'document', 'txt': 'document',
                        'mp4': 'video', 'mov': 'video', 'avi': 'video',
                        'mp3': 'audio', 'wav': 'audio'
                    };
                    if (extensionCategories[extension]) {
                        result.fileType = extension;
                        result.category = extensionCategories[extension];
                    }
                }
            }


            return result;
        } catch (error) {

            return { fileType: null, category: 'unknown', fileLink: null, fileName: null };
        }
    }

    function generateFilePreview(fileInfo) {

        if (!fileInfo || !fileInfo.fileLink) return '';

        const fileLink = fileInfo.fileLink;
        const escapedLink = fileLink.replace(/"/g, '&quot;');

        // Strip surrounding quotes from fileLink if present
        const fileName = fileInfo.fileName || "Unnamed File";
        // Remove unnecessary escaping unless quotes are embedded in the string
        const escapedFileName = fileName.replace(/"/g, '&quot;');




        switch (fileInfo.category) {
            case 'image':
                const imageHtml = `
                            <div class="post-image-container h-[450px] w-full">
                                <img src="${fileLink}" alt="${fileName}" class="post-image"
                                    style="height: 100%; width: 100%; object-fit: cover">
                            </div>`;

                return imageHtml;

            case 'video':
                return `
                            <!-- Video modal component -->
                            <div class="[&_[x-cloak]]:hidden" x-data="{
videoModal: false,
toggleModal() {
this.videoModal = !this.videoModal;
if (this.videoModal) {
document.body.style.overflow = 'hidden';
document.querySelectorAll('.block__style.z-depth-10.z-depth-10--hover.opt-border.dark-color-border.dark-color-border--hover').forEach(el => {
el.style.visibility = 'hidden';
});
} else {
document.body.style.overflow = '';
document.querySelectorAll('.block__style.z-depth-10.z-depth-10--hover.opt-border.dark-color-border.dark-color-border--hover').forEach(el => {
el.style.visibility = '';
});
}
}
}">
                                <!-- Video thumbnail with play button overlay -->
                                <div class="post-video-container relative rounded-lg overflow-hidden h-[450px] w-full cursor-pointer group shadow-lg"
                                    @click="openModal('Join your new community', '${escapedLink}', 'video', 'video', 'video')">
                                    <!-- Thumbnail preview (shows first frame of video) -->
                                    <video class="post-video h-full w-full object-cover" preload="metadata" muted>
                                        <source src="${escapedLink}" type="video/${fileInfo.fileType}">
                                        Your browser does not support the video tag.
                                    </video>

                                    <!-- Stylish play button overlay with hover effect -->
                                    <div
                                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                                        <div
                                            class="relative flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-80 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <svg class="w-8 h-8 text-indigo-600 fill-current" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 5v14l11-7z" fill="#007c8f" />

                                                <path>
                                            </svg>
                                        </div>
                                    </div>

                                    <!-- Optional video info overlay at bottom -->
                                    <div
                                        class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div class="text-white font-medium">Click to play video</div>
                                    </div>
                                </div>

                                <!-- Modal backdrop with transitions -->
                                <div class="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
                                    x-show="videoModal" x-transition:enter="transition ease-out duration-200"
                                    x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
                                    x-transition:leave="transition ease-out duration-200"
                                    x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
                                    @keydown.escape.window="toggleModal()" x-cloak></div>

                                <!-- Modal dialog -->
                                <div class="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6"
                                    x-show="videoModal" x-transition:enter="transition ease-out duration-300"
                                    x-transition:enter-start="opacity-0 scale-95"
                                    x-transition:enter-end="opacity-100 scale-100"
                                    x-transition:leave="transition ease-out duration-200"
                                    x-transition:leave-start="opacity-100 scale-100"
                                    x-transition:leave-end="opacity-0 scale-95" @click.self="toggleModal()" x-cloak>
                                    <div
                                        class="w-full max-w-5xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden bg-black">
                                        <div class="relative aspect-video">
                                            <!-- Custom video controls bar -->
                                            <div
                                                class="absolute top-0 left-0 right-0 flex justify-end p-3 z-10 bg-gradient-to-b from-black/70 to-transparent">
                                                <button
                                                    @click="toggleModal(); $nextTick(() => { $el.closest('.fixed').querySelector('.modal-video').pause() })"
                                                    class="rounded-full p-2 bg-black/50 text-white hover:bg-black/70 transition-colors"
                                                    aria-label="Close modal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                        viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <!-- Video player with controls -->
                                            <video class="modal-video w-full h-full object-contain" controls
                                                controlsList="nodownload"
                                                x-init="$watch('videoModal', value => !value && $el.pause())">
                                                <source src="${escapedLink}" type="video/${fileInfo.fileType}">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                </div>
                            </div> `;


            case 'audio':
                return `
                            <div class="flex flex-col gap-y-4  p-4 bg-[#ebf6f6] rounded" x-init="initPlayer()"
                                x-data="audioPlayer();">

                                <div class=" flex items-center justify-between">

                                    <div class="flex items-center gap-x-2" @click="muteUnmuteSound()">
                                        <svg x-bind:class="volume==0?'hidden':'block'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.7689 16.9995C14.7681 17.678 14.5903 18.3445 14.253 18.9332C13.9158 19.5219 13.4308 20.0124 12.8459 20.3562C12.6707 20.4434 12.4689 20.4606 12.2816 20.4042C12.0942 20.3479 11.9354 20.2223 11.8373 20.053C11.7393 19.8836 11.7095 19.6833 11.754 19.4928C11.7984 19.3022 11.9138 19.1358 12.0767 19.0274C12.4293 18.8192 12.7216 18.5227 12.9246 18.1671C13.1277 17.8115 13.2345 17.409 13.2345 16.9995C13.2345 16.59 13.1277 16.1876 12.9246 15.832C12.7216 15.4764 12.4293 15.1799 12.0767 14.9717C11.9138 14.8633 11.7984 14.6968 11.754 14.5063C11.7095 14.3158 11.7393 14.1155 11.8373 13.9461C11.9354 13.7768 12.0942 13.6512 12.2816 13.5949C12.4689 13.5385 12.6707 13.5557 12.8459 13.6429C13.4308 13.9867 13.9158 14.4772 14.253 15.0659C14.5903 15.6546 14.7681 16.3211 14.7689 16.9995ZM9.67867 12.0583C9.53814 12 9.38347 11.9847 9.23422 12.0143C9.08498 12.0439 8.94787 12.1171 8.84024 12.2247L6.75857 14.3073H4.76921C4.5652 14.3073 4.36955 14.3884 4.2253 14.5326C4.08104 14.6769 4 14.8725 4 15.0765V18.9226C4 19.1266 4.08104 19.3222 4.2253 19.4665C4.36955 19.6107 4.5652 19.6918 4.76921 19.6918H6.75857L8.84024 21.7744C8.94782 21.8821 9.08493 21.9555 9.23422 21.9852C9.38351 22.0149 9.53827 21.9997 9.6789 21.9414C9.81953 21.8831 9.9397 21.7845 10.0242 21.6579C10.1087 21.5312 10.1538 21.3824 10.1537 21.2302V12.7689C10.1536 12.6168 10.1085 12.4681 10.0239 12.3416C9.93939 12.2151 9.81924 12.1165 9.67867 12.0583ZM20.9226 8.15366V20.461C20.9226 20.869 20.7605 21.2603 20.472 21.5488C20.1835 21.8373 19.7922 21.9994 19.3841 21.9994H16.3073C16.1033 21.9994 15.9077 21.9184 15.7634 21.7741C15.6192 21.6298 15.5381 21.4342 15.5381 21.2302C15.5381 21.0262 15.6192 20.8305 15.7634 20.6863C15.9077 20.542 16.1033 20.461 16.3073 20.461H19.3841V8.92287H14.7689C14.5649 8.92287 14.3692 8.84183 14.225 8.69757C14.0807 8.55332 13.9997 8.35767 13.9997 8.15366V3.53842H5.53841V11.2305C5.53841 11.4345 5.45737 11.6301 5.31312 11.7744C5.16886 11.9187 4.97321 11.9997 4.76921 11.9997C4.5652 11.9997 4.36955 11.9187 4.2253 11.7744C4.08104 11.6301 4 11.4345 4 11.2305V3.53842C4 3.1304 4.16208 2.7391 4.45059 2.45059C4.7391 2.16208 5.1304 2 5.53841 2H14.7689C14.8699 1.99992 14.97 2.01975 15.0634 2.05836C15.1568 2.09696 15.2416 2.15358 15.3131 2.22499L20.6976 7.60945C20.769 7.68093 20.8256 7.76579 20.8642 7.85917C20.9028 7.95255 20.9226 8.05262 20.9226 8.15366ZM15.5381 7.38445H18.2967L15.5381 4.62588V7.38445Z"
                                                fill="#007C8F" />
                                        </svg>

                                        <svg x-bind:class="volume==0?'block':'hidden'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.7689 16.9995C14.7681 17.678 14.5903 18.3445 14.253 18.9332C13.9158 19.5219 13.4308 20.0124 12.8459 20.3562C12.6707 20.4434 12.4689 20.4606 12.2816 20.4042C12.0942 20.3479 11.9354 20.2223 11.8373 20.053C11.7393 19.8836 11.7095 19.6833 11.754 19.4928C11.7984 19.3022 11.9138 19.1358 12.0767 19.0274C12.4293 18.8192 12.7216 18.5227 12.9246 18.1671C13.1277 17.8115 13.2345 17.409 13.2345 16.9995C13.2345 16.59 13.1277 16.1876 12.9246 15.832C12.7216 15.4764 12.4293 15.1799 12.0767 14.9717C11.9138 14.8633 11.7984 14.6968 11.754 14.5063C11.7095 14.3158 11.7393 14.1155 11.8373 13.9461C11.9354 13.7768 12.0942 13.6512 12.2816 13.5949C12.4689 13.5385 12.6707 13.5557 12.8459 13.6429C13.4308 13.9867 13.9158 14.4772 14.253 15.0659C14.5903 15.6546 14.7681 16.3211 14.7689 16.9995ZM9.67867 12.0583C9.53814 12 9.38347 11.9847 9.23422 12.0143C9.08498 12.0439 8.94787 12.1171 8.84024 12.2247L6.75857 14.3073H4.76921C4.5652 14.3073 4.36955 14.3884 4.2253 14.5326C4.08104 14.6769 4 14.8725 4 15.0765V18.9226C4 19.1266 4.08104 19.3222 4.2253 19.4665C4.36955 19.6107 4.5652 19.6918 4.76921 19.6918H6.75857L8.84024 21.7744C8.94782 21.8821 9.08493 21.9555 9.23422 21.9852C9.38351 22.0149 9.53827 21.9997 9.6789 21.9414C9.81953 21.8831 9.9397 21.7845 10.0242 21.6579C10.1087 21.5312 10.1538 21.3824 10.1537 21.2302V12.7689C10.1536 12.6168 10.1085 12.4681 10.0239 12.3416C9.93939 12.2151 9.81924 12.1165 9.67867 12.0583ZM20.9226 8.15366V20.461C20.9226 20.869 20.7605 21.2603 20.472 21.5488C20.1835 21.8373 19.7922 21.9994 19.3841 21.9994H16.3073C16.1033 21.9994 15.9077 21.9184 15.7634 21.7741C15.6192 21.6298 15.5381 21.4342 15.5381 21.2302C15.5381 21.0262 15.6192 20.8305 15.7634 20.6863C15.9077 20.542 16.1033 20.461 16.3073 20.461H19.3841V8.92287H14.7689C14.5649 8.92287 14.3692 8.84183 14.225 8.69757C14.0807 8.55332 13.9997 8.35767 13.9997 8.15366V3.53842H5.53841V11.2305C5.53841 11.4345 5.45737 11.6301 5.31312 11.7744C5.16886 11.9187 4.97321 11.9997 4.76921 11.9997C4.5652 11.9997 4.36955 11.9187 4.2253 11.7744C4.08104 11.6301 4 11.4345 4 11.2305V3.53842C4 3.1304 4.16208 2.7391 4.45059 2.45059C4.7391 2.16208 5.1304 2 5.53841 2H14.7689C14.8699 1.99992 14.97 2.01975 15.0634 2.05836C15.1568 2.09696 15.2416 2.15358 15.3131 2.22499L20.6976 7.60945C20.769 7.68093 20.8256 7.76579 20.8642 7.85917C20.9028 7.95255 20.9226 8.05262 20.9226 8.15366ZM15.5381 7.38445H18.2967L15.5381 4.62588V7.38445Z"
                                                fill="#d3d3d3" />
                                        </svg>

                                        <div class="">Audio</div>
                                    </div>


                                    <div @click="downloadAudio()">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M22 14.5V21.1667C22 21.3877 21.9122 21.5996 21.7559 21.7559C21.5996 21.9122 21.3877 22 21.1667 22H2.83333C2.61232 22 2.40036 21.9122 2.24408 21.7559C2.0878 21.5996 2 21.3877 2 21.1667V14.5C2 14.279 2.0878 14.067 2.24408 13.9107C2.40036 13.7545 2.61232 13.6667 2.83333 13.6667C3.05435 13.6667 3.26631 13.7545 3.42259 13.9107C3.57887 14.067 3.66667 14.279 3.66667 14.5V20.3333H20.3333V14.5C20.3333 14.279 20.4211 14.067 20.5774 13.9107C20.7337 13.7545 20.9457 13.6667 21.1667 13.6667C21.3877 13.6667 21.5996 13.7545 21.7559 13.9107C21.9122 14.067 22 14.279 22 14.5ZM11.4104 15.0896C11.4878 15.1671 11.5797 15.2285 11.6809 15.2705C11.782 15.3124 11.8905 15.334 12 15.334C12.1095 15.334 12.218 15.3124 12.3191 15.2705C12.4203 15.2285 12.5122 15.1671 12.5896 15.0896L16.7563 10.9229C16.8729 10.8064 16.9524 10.6578 16.9846 10.4961C17.0168 10.3344 17.0003 10.1667 16.9372 10.0143C16.8741 9.86199 16.7671 9.73179 16.63 9.64023C16.4928 9.54867 16.3316 9.49987 16.1667 9.5H12.8333V2.83333C12.8333 2.61232 12.7455 2.40036 12.5893 2.24408C12.433 2.0878 12.221 2 12 2C11.779 2 11.567 2.0878 11.4107 2.24408C11.2545 2.40036 11.1667 2.61232 11.1667 2.83333V9.5H7.83333C7.66842 9.49987 7.50718 9.54867 7.37002 9.64023C7.23285 9.73179 7.12594 9.86199 7.06281 10.0143C6.99969 10.1667 6.98318 10.3344 7.01539 10.4961C7.0476 10.6578 7.12707 10.8064 7.24375 10.9229L11.4104 15.0896Z"
                                                fill="#007C8F" />
                                        </svg>

                                    </div>
                                </div>

                                <div class="flex items-center justify-between gap-x-4">
                                    <div x-on:click=" playPauseAudio()"
                                        class="w-7 p-2 bg-[#007c8f] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
                                        <svg x-show="!isPlaying" width="9" height="10" viewBox="0 0 9 10" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M8.46113 5C8.46145 5.13058 8.42797 5.25903 8.36394 5.37284C8.29992 5.48665 8.20753 5.58196 8.09577 5.64949L1.16917 9.88678C1.05239 9.95829 0.918642 9.99733 0.781731 9.99987C0.644819 10.0024 0.509713 9.96834 0.390366 9.90121C0.272155 9.83511 0.173682 9.73873 0.105074 9.62196C0.0364653 9.50519 0.000197518 9.37225 0 9.23682V0.763184C0.000197518 0.627751 0.0364653 0.494814 0.105074 0.378045C0.173682 0.261275 0.272155 0.164887 0.390366 0.0987929C0.509713 0.031656 0.644819 -0.00240351 0.781731 0.000131891C0.918642 0.00266729 1.05239 0.0417057 1.16917 0.113215L8.09577 4.35051C8.20753 4.41804 8.29992 4.51335 8.36394 4.62716C8.42797 4.74097 8.46145 4.86942 8.46113 5Z"
                                                fill="white" />
                                        </svg>


                                        <svg x-show="isPlaying" width="10" height="10" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                            <path
                                                d="M21.3333 3.66667V20.3333C21.3333 20.7754 21.1577 21.1993 20.8452 21.5118C20.5326 21.8244 20.1087 22 19.6667 22H15.5C15.058 22 14.6341 21.8244 14.3215 21.5118C14.0089 21.1993 13.8333 20.7754 13.8333 20.3333V3.66667C13.8333 3.22464 14.0089 2.80072 14.3215 2.48816C14.6341 2.17559 15.058 2 15.5 2H19.6667C20.1087 2 20.5326 2.17559 20.8452 2.48816C21.1577 2.80072 21.3333 3.22464 21.3333 3.66667ZM8.83333 2H4.66667C4.22464 2 3.80072 2.17559 3.48816 2.48816C3.17559 2.80072 3 3.22464 3 3.66667V20.3333C3 20.7754 3.17559 21.1993 3.48816 21.5118C3.80072 21.8244 4.22464 22 4.66667 22H8.83333C9.27536 22 9.69928 21.8244 10.0118 21.5118C10.3244 21.1993 10.5 20.7754 10.5 20.3333V3.66667C10.5 3.22464 10.3244 2.80072 10.0118 2.48816C9.69928 2.17559 9.27536 2 8.83333 2Z"
                                                fill="white"></path>
                                        </svg>
                                    </div>
                                    <div x-text="formattedTime" class="text-[#007c8f] label"></div>

                                    <div class="grow relative">
                                        <input x-model="currentTime" type="range" min="0" :max="duration" value="0"
                                            step="00.01" @input="seek()"
                                            class="w-full accent-gray-700  absolute top-1/2 left-0 -translate-y-1/2 bg-transparent cursor-pointer">
                                    </div>

                                    <div x-text="formattedRemainingTime" class="label text-[#007c8f]">-17:54</div>

                                    <div @click="muteUnmuteSound()">
                                        <svg x-bind:class=" volume==0?'hidden':'block'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.4123 3.70994V20.2114C14.4144 20.3348 14.3844 20.4568 14.3254 20.5652C14.2663 20.6737 14.1801 20.765 14.0752 20.8302C13.9561 20.9011 13.8183 20.9344 13.6799 20.9258C13.5415 20.9172 13.4089 20.8671 13.2995 20.782L7.64758 16.386C7.6066 16.3536 7.57352 16.3123 7.55082 16.2653C7.52813 16.2183 7.51641 16.1667 7.51656 16.1144V7.81202C7.51672 7.75958 7.52883 7.70787 7.55199 7.66082C7.57514 7.61377 7.60872 7.57262 7.65017 7.5405L13.3021 3.14449C13.4259 3.04851 13.5788 2.99758 13.7355 3.00009C13.8921 3.0026 14.0433 3.05839 14.164 3.15828C14.2433 3.22641 14.3067 3.31114 14.3496 3.40647C14.3925 3.50181 14.4139 3.60541 14.4123 3.70994ZM5.79264 7.82581H3.37914C3.01337 7.82581 2.66258 7.97111 2.40394 8.22975C2.1453 8.48839 2 8.83918 2 9.20495V14.7215C2 15.0873 2.1453 15.4381 2.40394 15.6967C2.66258 15.9554 3.01337 16.1007 3.37914 16.1007H5.79264C5.88408 16.1007 5.97178 16.0643 6.03644 15.9997C6.1011 15.935 6.13742 15.8473 6.13742 15.7559V8.1706C6.13742 8.07915 6.1011 7.99146 6.03644 7.9268C5.97178 7.86214 5.88408 7.82581 5.79264 7.82581ZM16.7197 9.62214C16.6516 9.68198 16.596 9.75466 16.556 9.83602C16.5161 9.91738 16.4925 10.0058 16.4868 10.0963C16.481 10.1868 16.4931 10.2775 16.5224 10.3632C16.5518 10.449 16.5977 10.5282 16.6577 10.5962C16.9903 10.9739 17.1738 11.4599 17.1738 11.9632C17.1738 12.4665 16.9903 12.9526 16.6577 13.3303C16.5961 13.398 16.5486 13.4772 16.518 13.5634C16.4873 13.6495 16.4741 13.741 16.4791 13.8323C16.4842 13.9236 16.5073 14.013 16.5472 14.0953C16.5871 14.1777 16.643 14.2512 16.7116 14.3117C16.7802 14.3722 16.8602 14.4184 16.9469 14.4477C17.0335 14.477 17.1251 14.4887 17.2164 14.4823C17.3076 14.4758 17.3967 14.4513 17.4783 14.4101C17.56 14.3689 17.6326 14.3118 17.692 14.2423C18.2467 13.6126 18.5527 12.8023 18.5527 11.9632C18.5527 11.1241 18.2467 10.3138 17.692 9.6842C17.6322 9.61598 17.5595 9.56025 17.478 9.52019C17.3966 9.48014 17.308 9.45655 17.2175 9.45078C17.1269 9.44502 17.0361 9.45719 16.9502 9.48659C16.8644 9.516 16.7852 9.56206 16.7172 9.62214H16.7197ZM20.2443 7.36639C20.185 7.29547 20.112 7.2372 20.0297 7.19507C19.9474 7.15293 19.8574 7.12777 19.7652 7.1211C19.673 7.11443 19.5803 7.12637 19.4928 7.15623C19.4053 7.18608 19.3247 7.23322 19.2558 7.29487C19.1868 7.35651 19.131 7.43138 19.0916 7.51503C19.0522 7.59869 19.03 7.68941 19.0264 7.78181C19.0228 7.8742 19.0378 7.96639 19.0705 8.05287C19.1032 8.13936 19.153 8.21838 19.2168 8.28524C20.1216 9.29669 20.6219 10.6062 20.6219 11.9632C20.6219 13.3203 20.1216 14.6298 19.2168 15.6412C19.153 15.7081 19.1032 15.7871 19.0705 15.8736C19.0378 15.9601 19.0228 16.0523 19.0264 16.1447C19.03 16.2371 19.0522 16.3278 19.0916 16.4114C19.131 16.4951 19.1868 16.57 19.2558 16.6316C19.3247 16.6932 19.4053 16.7404 19.4928 16.7702C19.5803 16.8001 19.673 16.812 19.7652 16.8054C19.8574 16.7987 19.9474 16.7735 20.0297 16.7314C20.112 16.6893 20.185 16.631 20.2443 16.5601C21.3749 15.2959 22 13.6593 22 11.9632C22 10.2672 21.3749 8.63061 20.2443 7.36639Z"
                                                fill="#007C8F" />
                                        </svg>

                                        <svg x-bind:class="volume==0?'block':'hidden'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            class="block">
                                            <path
                                                d="M21.7979 13.5452C21.9273 13.6746 22 13.8501 22 14.0331C22 14.2161 21.9273 14.3916 21.7979 14.521C21.6685 14.6504 21.493 14.7231 21.31 14.7231C21.127 14.7231 20.9515 14.6504 20.8221 14.521L19.241 12.9391L17.66 14.521C17.5306 14.6504 17.3551 14.7231 17.1721 14.7231C16.9891 14.7231 16.8136 14.6504 16.6842 14.521C16.5548 14.3916 16.4821 14.2161 16.4821 14.0331C16.4821 13.8501 16.5548 13.6746 16.6842 13.5452L18.2661 11.9642L16.6842 10.3832C16.5548 10.2538 16.4821 10.0782 16.4821 9.89524C16.4821 9.71223 16.5548 9.53672 16.6842 9.40732C16.8136 9.27791 16.9891 9.20521 17.1721 9.20521C17.3551 9.20521 17.5306 9.27791 17.66 9.40732L19.241 10.9892L20.8221 9.40732C20.9515 9.27791 21.127 9.20521 21.31 9.20521C21.493 9.20521 21.6685 9.27791 21.7979 9.40732C21.9273 9.53672 22 9.71223 22 9.89524C22 10.0782 21.9273 10.2538 21.7979 10.3832L20.216 11.9642L21.7979 13.5452ZM5.79303 7.82631H3.37928C3.01348 7.82631 2.66265 7.97163 2.40398 8.2303C2.14532 8.48896 2 8.83979 2 9.2056V14.7227C2 15.0885 2.14532 15.4394 2.40398 15.698C2.66265 15.9567 3.01348 16.102 3.37928 16.102H5.79303C5.88448 16.102 5.97219 16.0657 6.03686 16.001C6.10152 15.9364 6.13785 15.8486 6.13785 15.7572V8.17113C6.13785 8.07968 6.10152 7.99198 6.03686 7.92731C5.97219 7.86264 5.88448 7.82631 5.79303 7.82631ZM14.1679 3.1583C14.0471 3.0584 13.896 3.0026 13.7393 3.00009C13.5826 2.99758 13.4297 3.04852 13.3058 3.14451L7.65334 7.54098C7.61141 7.57283 7.57733 7.61387 7.55372 7.66094C7.53011 7.70801 7.5176 7.75986 7.51714 7.81252V16.1158C7.51729 16.1683 7.52941 16.22 7.55256 16.267C7.57572 16.3141 7.6093 16.3552 7.65075 16.3874L13.3032 20.7838C13.4127 20.8689 13.5453 20.9191 13.6837 20.9277C13.8221 20.9363 13.9599 20.903 14.0791 20.8321C14.184 20.7669 14.2701 20.6755 14.3292 20.5671C14.3883 20.4586 14.4182 20.3366 14.4161 20.2131V3.71001C14.4174 3.60527 14.3956 3.50153 14.3523 3.40617C14.3089 3.31082 14.2451 3.22618 14.1653 3.1583H14.1679Z"
                                                fill="#007C8F"></path>
                                        </svg>
                                    </div>

                                </div>

                                <audio class="hidden" x-ref="audioElement" @timeupdate="updateProgress()"
                                    @loadedmetadata="loadMetadatafn()" @volumeChange="updateVolume()"
                                    @ended="isPlaying = false" src=${escapedLink} controls></audio>
                            </div>

                            `;

            case 'document':
                if (fileInfo.fileType === 'pdf' || fileInfo.fileType === "zip") {
                    return `
                            <div class="post-pdf-container p-4 bg-[#c7e6e6] rounded">
                                <!--iframe src="${escapedLink}" class="pdf-preview "></iframe-->


                                <div class="flex items-center justify-between">

                                    <div class="flex items-center gap-x-2">
                                        <svg width="17" height="20" viewBox="0 0 17 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M16.6981 5.60962L11.3135 0.225C11.242 0.153589 11.1571 0.0969631 11.0637 0.0583569C10.9704 0.0197506 10.8703 -7.92199e-05 10.7692 2.37845e-07H1.53846C1.13044 2.37845e-07 0.739122 0.162088 0.450605 0.450605C0.162087 0.739123 0 1.13044 0 1.53846V18.4615C0 18.8696 0.162087 19.2609 0.450605 19.5494C0.739122 19.8379 1.13044 20 1.53846 20H15.3846C15.7926 20 16.184 19.8379 16.4725 19.5494C16.761 19.2609 16.9231 18.8696 16.9231 18.4615V6.15385C16.9232 6.0528 16.9033 5.95273 16.8647 5.85935C16.8261 5.76597 16.7695 5.68111 16.6981 5.60962ZM11.5385 14.6154H5.38462C5.1806 14.6154 4.98495 14.5343 4.84069 14.3901C4.69643 14.2458 4.61538 14.0502 4.61538 13.8462C4.61538 13.6421 4.69643 13.4465 4.84069 13.3022C4.98495 13.158 5.1806 13.0769 5.38462 13.0769H11.5385C11.7425 13.0769 11.9381 13.158 12.0824 13.3022C12.2266 13.4465 12.3077 13.6421 12.3077 13.8462C12.3077 14.0502 12.2266 14.2458 12.0824 14.3901C11.9381 14.5343 11.7425 14.6154 11.5385 14.6154ZM11.5385 11.5385H5.38462C5.1806 11.5385 4.98495 11.4574 4.84069 11.3132C4.69643 11.1689 4.61538 10.9732 4.61538 10.7692C4.61538 10.5652 4.69643 10.3696 4.84069 10.2253C4.98495 10.081 5.1806 10 5.38462 10H11.5385C11.7425 10 11.9381 10.081 12.0824 10.2253C12.2266 10.3696 12.3077 10.5652 12.3077 10.7692C12.3077 10.9732 12.2266 11.1689 12.0824 11.3132C11.9381 11.4574 11.7425 11.5385 11.5385 11.5385ZM10.7692 6.15385V1.92308L15 6.15385H10.7692Z"
                                                fill="#007C8F"></path>
                                        </svg>



                                        <div class="relative w-fit">
                                            <a href="${escapedLink}" target="_blank" title="${escapedFileName}"
                                                class="file-download-link  text-[#007c8f] w-max font-[600] text-[14px] leading-[18px]  max-[660px]:truncate max-[660px]:max-w-[20ch] rounded  ">
                                                ${escapedFileName}
                                            </a>
                                        </div>
                                    </div>



                                    <a href="${escapedLink}" target="_blank">
                                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.9425 6.39667C19.9133 6.33084 19.2075 4.765 17.6383 3.19584C15.5475 1.105 12.9066 0 9.99997 0C7.0933 0 4.45247 1.105 2.36163 3.19584C0.792462 4.765 0.0832949 6.33334 0.0574615 6.39667C0.0195558 6.48193 -3.05176e-05 6.5742 -3.05176e-05 6.6675C-3.05176e-05 6.76081 0.0195558 6.85308 0.0574615 6.93834C0.0866282 7.00417 0.792462 8.56917 2.36163 10.1383C4.45247 12.2283 7.0933 13.3333 9.99997 13.3333C12.9066 13.3333 15.5475 12.2283 17.6383 10.1383C19.2075 8.56917 19.9133 7.00417 19.9425 6.93834C19.9804 6.85308 20 6.76081 20 6.6675C20 6.5742 19.9804 6.48193 19.9425 6.39667ZM9.99997 10C9.3407 10 8.69623 9.80451 8.14807 9.43824C7.5999 9.07197 7.17266 8.55137 6.92037 7.94228C6.66808 7.3332 6.60206 6.66297 6.73068 6.01637C6.8593 5.36977 7.17677 4.77582 7.64294 4.30965C8.10912 3.84347 8.70306 3.526 9.34967 3.39738C9.99627 3.26877 10.6665 3.33478 11.2756 3.58707C11.8847 3.83936 12.4053 4.26661 12.7715 4.81477C13.1378 5.36293 13.3333 6.0074 13.3333 6.66667C13.3333 7.55073 12.9821 8.39857 12.357 9.0237C11.7319 9.64882 10.884 10 9.99997 10Z"
                                                fill="#007C8F" />
                                        </svg>

                                    </a>

                                </div>
                            </div>`;
                }

            default:
                return `
                            <div class="post-pdf-container p-4 bg-[#c7e6e6] rounded">
                                <!--iframe src="${escapedLink}" class="pdf-preview "></iframe-->


                                <div class="flex items-center justify-between">

                                    <div class="flex items-center gap-x-2">
                                        <svg width="17" height="20" viewBox="0 0 17 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M16.6981 5.60962L11.3135 0.225C11.242 0.153589 11.1571 0.0969631 11.0637 0.0583569C10.9704 0.0197506 10.8703 -7.92199e-05 10.7692 2.37845e-07H1.53846C1.13044 2.37845e-07 0.739122 0.162088 0.450605 0.450605C0.162087 0.739123 0 1.13044 0 1.53846V18.4615C0 18.8696 0.162087 19.2609 0.450605 19.5494C0.739122 19.8379 1.13044 20 1.53846 20H15.3846C15.7926 20 16.184 19.8379 16.4725 19.5494C16.761 19.2609 16.9231 18.8696 16.9231 18.4615V6.15385C16.9232 6.0528 16.9033 5.95273 16.8647 5.85935C16.8261 5.76597 16.7695 5.68111 16.6981 5.60962ZM11.5385 14.6154H5.38462C5.1806 14.6154 4.98495 14.5343 4.84069 14.3901C4.69643 14.2458 4.61538 14.0502 4.61538 13.8462C4.61538 13.6421 4.69643 13.4465 4.84069 13.3022C4.98495 13.158 5.1806 13.0769 5.38462 13.0769H11.5385C11.7425 13.0769 11.9381 13.158 12.0824 13.3022C12.2266 13.4465 12.3077 13.6421 12.3077 13.8462C12.3077 14.0502 12.2266 14.2458 12.0824 14.3901C11.9381 14.5343 11.7425 14.6154 11.5385 14.6154ZM11.5385 11.5385H5.38462C5.1806 11.5385 4.98495 11.4574 4.84069 11.3132C4.69643 11.1689 4.61538 10.9732 4.61538 10.7692C4.61538 10.5652 4.69643 10.3696 4.84069 10.2253C4.98495 10.081 5.1806 10 5.38462 10H11.5385C11.7425 10 11.9381 10.081 12.0824 10.2253C12.2266 10.3696 12.3077 10.5652 12.3077 10.7692C12.3077 10.9732 12.2266 11.1689 12.0824 11.3132C11.9381 11.4574 11.7425 11.5385 11.5385 11.5385ZM10.7692 6.15385V1.92308L15 6.15385H10.7692Z"
                                                fill="#007C8F"></path>
                                        </svg>


                                        <a href="${escapedLink}" target="_blank" title="${escapedFileName}"
                                            class="file-download-link  text-[#007c8f] w-max font-[600] text-[14px] leading-[18px]  max-[660px]:truncate max-[660px]:max-w-[20ch]  rounded">
                                            View PDF: ${escapedFileName}
                                        </a>
                                    </div>



                                    <a href="${escapedLink}" target="_blank">
                                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.9425 6.39667C19.9133 6.33084 19.2075 4.765 17.6383 3.19584C15.5475 1.105 12.9066 0 9.99997 0C7.0933 0 4.45247 1.105 2.36163 3.19584C0.792462 4.765 0.0832949 6.33334 0.0574615 6.39667C0.0195558 6.48193 -3.05176e-05 6.5742 -3.05176e-05 6.6675C-3.05176e-05 6.76081 0.0195558 6.85308 0.0574615 6.93834C0.0866282 7.00417 0.792462 8.56917 2.36163 10.1383C4.45247 12.2283 7.0933 13.3333 9.99997 13.3333C12.9066 13.3333 15.5475 12.2283 17.6383 10.1383C19.2075 8.56917 19.9133 7.00417 19.9425 6.93834C19.9804 6.85308 20 6.76081 20 6.6675C20 6.5742 19.9804 6.48193 19.9425 6.39667ZM9.99997 10C9.3407 10 8.69623 9.80451 8.14807 9.43824C7.5999 9.07197 7.17266 8.55137 6.92037 7.94228C6.66808 7.3332 6.60206 6.66297 6.73068 6.01637C6.8593 5.36977 7.17677 4.77582 7.64294 4.30965C8.10912 3.84347 8.70306 3.526 9.34967 3.39738C9.99627 3.26877 10.6665 3.33478 11.2756 3.58707C11.8847 3.83936 12.4053 4.26661 12.7715 4.81477C13.1378 5.36293 13.3333 6.0074 13.3333 6.66667C13.3333 7.55073 12.9821 8.39857 12.357 9.0237C11.7319 9.64882 10.884 10 9.99997 10Z"
                                                fill="#007C8F" />
                                        </svg>

                                    </a>

                                </div>
                            </div>`;
        }
    }





    document.addEventListener("alpine:init", () => {
        Alpine.data("videoModal", (videoUrl) => ({
            modalOpen: false,
            videoSrc: videoUrl,
            thumbnail: "https://via.placeholder.com/768x432?text=Loading+Thumbnail",
            openModal() {
                this.modalOpen = true;
                this.stopOtherVideos();
                this.$nextTick(() => {
                    this.$refs.videoPlayer.play();
                });
            },
            closeModal() {
                this.modalOpen = false;
                this.$nextTick(() => {
                    this.$refs.videoPlayer.pause();
                });
            },
            stopOtherVideos() {
                document.querySelectorAll("video").forEach((video) => {
                    if (video !== this.$refs.videoPlayer) {
                        video.pause();
                    }
                });
            },
            generateThumbnail() {
                const video = document.createElement("video");
                video.src = this.videoSrc;
                video.crossOrigin = "anonymous";
                video.muted = true;

                video.addEventListener("loadeddata", () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    video.currentTime = 2;

                    video.addEventListener("seeked", () => {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        this.thumbnail = canvas.toDataURL("image/png");
                    });
                });
            },
            init() {
                this.generateThumbnail();
            }
        }));
    });




    function extractAndConvertToEmbedUrls(data) {
        const urlRegex = /https?:\/\/[^\s]+/g;

        const urls = data.match(urlRegex) || [];

        const embeddableUrls = urls.map(url => {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                return convertYouTubeUrlToEmbed(url);
            } else if (url.includes('vimeo.com')) {
                return convertVimeoUrlToEmbed(url);
            } else if (url.includes('loom.com')) {
                return convertLoomUrlToEmbed(url);
            } else {
                return null;
            }
        }).filter(url => url !== null);

        const formattedPostText = data.replace(urlRegex, url => {
            return `<a href="${url}" target="_blank"
                                style="color: blue; text-decoration: underline;">${url}</a>`;
        });

        return {
            embeddableUrls: embeddableUrls,
            formattedPostText: formattedPostText
        };
    }


    function convertYouTubeUrlToEmbed(url) {
        const youtubeRegex =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return null;
    }


    function convertVimeoUrlToEmbed(url) {
        const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
        const match = url.match(vimeoRegex);
        if (match && match[1]) {
            return `https://player.vimeo.com/video/${match[1]}`;
        }
        return null;
    }


    function convertLoomUrlToEmbed(url) {
        const loomRegex = /(?:https?:\/\/)?(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+)/;
        const match = url.match(loomRegex);
        if (match && match[1]) {
            return `https://www.loom.com/embed/${match[1]}`;
        }
        return null;
    }



    document.addEventListener("DOMContentLoaded", function () {
        const images = document.querySelectorAll("img");

        const newSrc =
            "https://file.ontraport.com/media/d297d307c0b44ab987c4c3ea6ce4f4d1.phpn85eue?Expires=4894682981&Signature=ITOEXhMnfN8RhJFBAPNE1r88KEv0EiFdNUDs1XFJWHGM-VHUgvnRlmbUxX6NrMESiC0IcQBi~Ev-jWHzgWDaUhEQOkljQgB2uLQHrxc2wlH~coXW8ZHT0aOWH160uZd5a6gUgnZWzNoIFU01RQZsxHjvc4Ds~lUpCiIeAKycYgwvZsPv5ir1tKuH~o7HUjfmCNdbStVMhSzfmyvsgP6uDCFspM19KtePjXy~rWteI8vFqltP28VLVNhUVCJ3jT29DiHdZRMYMeDUWVdYFBgebh~cCepChYOMG1ZGlfun9YtYDLuA7O93C2COEScR~gfomDrBDU5dgFXspiXnbTp58w__&Key-Pair-Id=APKAJVAAMVW6XQYWSTNA";

        images.forEach(img => {
            let src = img.getAttribute("src")?.trim();
            if (src) {
                src = src.replace(/^['"]|['"]$/g, "");
            }

            if (!src || src === "https://i.ontraport.com/abc.jpg" || src ===
                "https://i.ontraport.com/265848.e4eb6c354950b9d6fcd6df912e177552.JPEG") {
                img.src = newSrc;
            }
        });
    });



    function populatePreviewContainer(el) {
        // Get preview container reference first
        const previewContainer = el.closest(".flex.items-center.justify-end.gap-2")
            ?.previousElementSibling;

        if (!previewContainer) {

            return;
        }

        // Handle file selection
        if (el.files && el.files[0]) {
            const file = el.files[0];

            if (file.type.startsWith('image')) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    previewContainer.classList.remove('hidden');
                    previewContainer.innerHTML = `
                            <img src="${e.target.result}" class="w-full max-h-full object-cover h-[450px]"
                                alt="Image preview">
                            `;
                };

                reader.readAsDataURL(file);
            } else if (file.type.startsWith('audio')) {
                const audioUrl = URL.createObjectURL(file);
                previewContainer.classList.remove('hidden');
                previewContainer.innerHTML = '';

                const audioPlayerHTML = `
                            <div class="flex flex-col gap-y-4  p-4 bg-[#ebf6f6]" x-init="initPlayer()"
                                x-data="audioPlayer();">
                                <div class=" flex items-center justify-between">
                                    <div class="flex items-center gap-x-2" @click="muteUnmuteSound()">
                                        <svg x-bind:class="volume==0?'hidden':'block'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.7689 16.9995C14.7681 17.678 14.5903 18.3445 14.253 18.9332C13.9158 19.5219 13.4308 20.0124 12.8459 20.3562C12.6707 20.4434 12.4689 20.4606 12.2816 20.4042C12.0942 20.3479 11.9354 20.2223 11.8373 20.053C11.7393 19.8836 11.7095 19.6833 11.754 19.4928C11.7984 19.3022 11.9138 19.1358 12.0767 19.0274C12.4293 18.8192 12.7216 18.5227 12.9246 18.1671C13.1277 17.8115 13.2345 17.409 13.2345 16.9995C13.2345 16.59 13.1277 16.1876 12.9246 15.832C12.7216 15.4764 12.4293 15.1799 12.0767 14.9717C11.9138 14.8633 11.7984 14.6968 11.754 14.5063C11.7095 14.3158 11.7393 14.1155 11.8373 13.9461C11.9354 13.7768 12.0942 13.6512 12.2816 13.5949C12.4689 13.5385 12.6707 13.5557 12.8459 13.6429C13.4308 13.9867 13.9158 14.4772 14.253 15.0659C14.5903 15.6546 14.7681 16.3211 14.7689 16.9995ZM9.67867 12.0583C9.53814 12 9.38347 11.9847 9.23422 12.0143C9.08498 12.0439 8.94787 12.1171 8.84024 12.2247L6.75857 14.3073H4.76921C4.5652 14.3073 4.36955 14.3884 4.2253 14.5326C4.08104 14.6769 4 14.8725 4 15.0765V18.9226C4 19.1266 4.08104 19.3222 4.2253 19.4665C4.36955 19.6107 4.5652 19.6918 4.76921 19.6918H6.75857L8.84024 21.7744C8.94782 21.8821 9.08493 21.9555 9.23422 21.9852C9.38351 22.0149 9.53827 21.9997 9.6789 21.9414C9.81953 21.8831 9.9397 21.7845 10.0242 21.6579C10.1087 21.5312 10.1538 21.3824 10.1537 21.2302V12.7689C10.1536 12.6168 10.1085 12.4681 10.0239 12.3416C9.93939 12.2151 9.81924 12.1165 9.67867 12.0583ZM20.9226 8.15366V20.461C20.9226 20.869 20.7605 21.2603 20.472 21.5488C20.1835 21.8373 19.7922 21.9994 19.3841 21.9994H16.3073C16.1033 21.9994 15.9077 21.9184 15.7634 21.7741C15.6192 21.6298 15.5381 21.4342 15.5381 21.2302C15.5381 21.0262 15.6192 20.8305 15.7634 20.6863C15.9077 20.542 16.1033 20.461 16.3073 20.461H19.3841V8.92287H14.7689C14.5649 8.92287 14.3692 8.84183 14.225 8.69757C14.0807 8.55332 13.9997 8.35767 13.9997 8.15366V3.53842H5.53841V11.2305C5.53841 11.4345 5.45737 11.6301 5.31312 11.7744C5.16886 11.9187 4.97321 11.9997 4.76921 11.9997C4.5652 11.9997 4.36955 11.9187 4.2253 11.7744C4.08104 11.6301 4 11.4345 4 11.2305V3.53842C4 3.1304 4.16208 2.7391 4.45059 2.45059C4.7391 2.16208 5.1304 2 5.53841 2H14.7689C14.8699 1.99992 14.97 2.01975 15.0634 2.05836C15.1568 2.09696 15.2416 2.15358 15.3131 2.22499L20.6976 7.60945C20.769 7.68093 20.8256 7.76579 20.8642 7.85917C20.9028 7.95255 20.9226 8.05262 20.9226 8.15366ZM15.5381 7.38445H18.2967L15.5381 4.62588V7.38445Z"
                                                fill="#007C8F" />
                                        </svg>
                                        <svg x-bind:class="volume==0?'block':'hidden'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.7689 16.9995C14.7681 17.678 14.5903 18.3445 14.253 18.9332C13.9158 19.5219 13.4308 20.0124 12.8459 20.3562C12.6707 20.4434 12.4689 20.4606 12.2816 20.4042C12.0942 20.3479 11.9354 20.2223 11.8373 20.053C11.7393 19.8836 11.7095 19.6833 11.754 19.4928C11.7984 19.3022 11.9138 19.1358 12.0767 19.0274C12.4293 18.8192 12.7216 18.5227 12.9246 18.1671C13.1277 17.8115 13.2345 17.409 13.2345 16.9995C13.2345 16.59 13.1277 16.1876 12.9246 15.832C12.7216 15.4764 12.4293 15.1799 12.0767 14.9717C11.9138 14.8633 11.7984 14.6968 11.754 14.5063C11.7095 14.3158 11.7393 14.1155 11.8373 13.9461C11.9354 13.7768 12.0942 13.6512 12.2816 13.5949C12.4689 13.5385 12.6707 13.5557 12.8459 13.6429C13.4308 13.9867 13.9158 14.4772 14.253 15.0659C14.5903 15.6546 14.7681 16.3211 14.7689 16.9995ZM9.67867 12.0583C9.53814 12 9.38347 11.9847 9.23422 12.0143C9.08498 12.0439 8.94787 12.1171 8.84024 12.2247L6.75857 14.3073H4.76921C4.5652 14.3073 4.36955 14.3884 4.2253 14.5326C4.08104 14.6769 4 14.8725 4 15.0765V18.9226C4 19.1266 4.08104 19.3222 4.2253 19.4665C4.36955 19.6107 4.5652 19.6918 4.76921 19.6918H6.75857L8.84024 21.7744C8.94782 21.8821 9.08493 21.9555 9.23422 21.9852C9.38351 22.0149 9.53827 21.9997 9.6789 21.9414C9.81953 21.8831 9.9397 21.7845 10.0242 21.6579C10.1087 21.5312 10.1538 21.3824 10.1537 21.2302V12.7689C10.1536 12.6168 10.1085 12.4681 10.0239 12.3416C9.93939 12.2151 9.81924 12.1165 9.67867 12.0583ZM20.9226 8.15366V20.461C20.9226 20.869 20.7605 21.2603 20.472 21.5488C20.1835 21.8373 19.7922 21.9994 19.3841 21.9994H16.3073C16.1033 21.9994 15.9077 21.9184 15.7634 21.7741C15.6192 21.6298 15.5381 21.4342 15.5381 21.2302C15.5381 21.0262 15.6192 20.8305 15.7634 20.6863C15.9077 20.542 16.1033 20.461 16.3073 20.461H19.3841V8.92287H14.7689C14.5649 8.92287 14.3692 8.84183 14.225 8.69757C14.0807 8.55332 13.9997 8.35767 13.9997 8.15366V3.53842H5.53841V11.2305C5.53841 11.4345 5.45737 11.6301 5.31312 11.7744C5.16886 11.9187 4.97321 11.9997 4.76921 11.9997C4.5652 11.9997 4.36955 11.9187 4.2253 11.7744C4.08104 11.6301 4 11.4345 4 11.2305V3.53842C4 3.1304 4.16208 2.7391 4.45059 2.45059C4.7391 2.16208 5.1304 2 5.53841 2H14.7689C14.8699 1.99992 14.97 2.01975 15.0634 2.05836C15.1568 2.09696 15.2416 2.15358 15.3131 2.22499L20.6976 7.60945C20.769 7.68093 20.8256 7.76579 20.8642 7.85917C20.9028 7.95255 20.9226 8.05262 20.9226 8.15366ZM15.5381 7.38445H18.2967L15.5381 4.62588V7.38445Z"
                                                fill="#d3d3d3" />
                                        </svg>

                                        <div class="">Audio</div>
                                    </div>
                                    <div @click="downloadAudio()">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M22 14.5V21.1667C22 21.3877 21.9122 21.5996 21.7559 21.7559C21.5996 21.9122 21.3877 22 21.1667 22H2.83333C2.61232 22 2.40036 21.9122 2.24408 21.7559C2.0878 21.5996 2 21.3877 2 21.1667V14.5C2 14.279 2.0878 14.067 2.24408 13.9107C2.40036 13.7545 2.61232 13.6667 2.83333 13.6667C3.05435 13.6667 3.26631 13.7545 3.42259 13.9107C3.57887 14.067 3.66667 14.279 3.66667 14.5V20.3333H20.3333V14.5C20.3333 14.279 20.4211 14.067 20.5774 13.9107C20.7337 13.7545 20.9457 13.6667 21.1667 13.6667C21.3877 13.6667 21.5996 13.7545 21.7559 13.9107C21.9122 14.067 22 14.279 22 14.5ZM11.4104 15.0896C11.4878 15.1671 11.5797 15.2285 11.6809 15.2705C11.782 15.3124 11.8905 15.334 12 15.334C12.1095 15.334 12.218 15.3124 12.3191 15.2705C12.4203 15.2285 12.5122 15.1671 12.5896 15.0896L16.7563 10.9229C16.8729 10.8064 16.9524 10.6578 16.9846 10.4961C17.0168 10.3344 17.0003 10.1667 16.9372 10.0143C16.8741 9.86199 16.7671 9.73179 16.63 9.64023C16.4928 9.54867 16.3316 9.49987 16.1667 9.5H12.8333V2.83333C12.8333 2.61232 12.7455 2.40036 12.5893 2.24408C12.433 2.0878 12.221 2 12 2C11.779 2 11.567 2.0878 11.4107 2.24408C11.2545 2.40036 11.1667 2.61232 11.1667 2.83333V9.5H7.83333C7.66842 9.49987 7.50718 9.54867 7.37002 9.64023C7.23285 9.73179 7.12594 9.86199 7.06281 10.0143C6.99969 10.1667 6.98318 10.3344 7.01539 10.4961C7.0476 10.6578 7.12707 10.8064 7.24375 10.9229L11.4104 15.0896Z"
                                                fill="#007C8F" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between gap-x-4">
                                    <div x-on:click=" playPauseAudio()"
                                        class="w-7 p-2 bg-[#007c8f] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
                                        <svg x-show="!isPlaying" width="9" height="10" viewBox="0 0 9 10" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M8.46113 5C8.46145 5.13058 8.42797 5.25903 8.36394 5.37284C8.29992 5.48665 8.20753 5.58196 8.09577 5.64949L1.16917 9.88678C1.05239 9.95829 0.918642 9.99733 0.781731 9.99987C0.644819 10.0024 0.509713 9.96834 0.390366 9.90121C0.272155 9.83511 0.173682 9.73873 0.105074 9.62196C0.0364653 9.50519 0.000197518 9.37225 0 9.23682V0.763184C0.000197518 0.627751 0.0364653 0.494814 0.105074 0.378045C0.173682 0.261275 0.272155 0.164887 0.390366 0.0987929C0.509713 0.031656 0.644819 -0.00240351 0.781731 0.000131891C0.918642 0.00266729 1.05239 0.0417057 1.16917 0.113215L8.09577 4.35051C8.20753 4.41804 8.29992 4.51335 8.36394 4.62716C8.42797 4.74097 8.46145 4.86942 8.46113 5Z"
                                                fill="white" />
                                        </svg>
                                        <svg x-show="isPlaying" width="10" height="10" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                            <path
                                                d="M21.3333 3.66667V20.3333C21.3333 20.7754 21.1577 21.1993 20.8452 21.5118C20.5326 21.8244 20.1087 22 19.6667 22H15.5C15.058 22 14.6341 21.8244 14.3215 21.5118C14.0089 21.1993 13.8333 20.7754 13.8333 20.3333V3.66667C13.8333 3.22464 14.0089 2.80072 14.3215 2.48816C14.6341 2.17559 15.058 2 15.5 2H19.6667C20.1087 2 20.5326 2.17559 20.8452 2.48816C21.1577 2.80072 21.3333 3.22464 21.3333 3.66667ZM8.83333 2H4.66667C4.22464 2 3.80072 2.17559 3.48816 2.48816C3.17559 2.80072 3 3.22464 3 3.66667V20.3333C3 20.7754 3.17559 21.1993 3.48816 21.5118C3.80072 21.8244 4.22464 22 4.66667 22H8.83333C9.27536 22 9.69928 21.8244 10.0118 21.5118C10.3244 21.1993 10.5 20.7754 10.5 20.3333V3.66667C10.5 3.22464 10.3244 2.80072 10.0118 2.48816C9.69928 2.17559 9.27536 2 8.83333 2Z"
                                                fill="white"></path>
                                        </svg>
                                    </div>
                                    <div x-text="formattedTime" class="text-[#007c8f] label"></div>
                                    <div class="grow relative">
                                        <input x-model="currentTime" type="range" min="0" :max="duration" value="0"
                                            step="00.01" @input="seek()"
                                            class="w-full accent-gray-700  absolute top-1/2 left-0 -translate-y-1/2 bg-transparent cursor-pointer">
                                    </div>
                                    <div x-text="formattedRemainingTime" class="label text-[#007c8f]">-17:54</div>
                                    <div @click="muteUnmuteSound()">
                                        <svg x-bind:class=" volume==0?'hidden':'block'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.4123 3.70994V20.2114C14.4144 20.3348 14.3844 20.4568 14.3254 20.5652C14.2663 20.6737 14.1801 20.765 14.0752 20.8302C13.9561 20.9011 13.8183 20.9344 13.6799 20.9258C13.5415 20.9172 13.4089 20.8671 13.2995 20.782L7.64758 16.386C7.6066 16.3536 7.57352 16.3123 7.55082 16.2653C7.52813 16.2183 7.51641 16.1667 7.51656 16.1144V7.81202C7.51672 7.75958 7.52883 7.70787 7.55199 7.66082C7.57514 7.61377 7.60872 7.57262 7.65017 7.5405L13.3021 3.14449C13.4259 3.04851 13.5788 2.99758 13.7355 3.00009C13.8921 3.0026 14.0433 3.05839 14.164 3.15828C14.2433 3.22641 14.3067 3.31114 14.3496 3.40647C14.3925 3.50181 14.4139 3.60541 14.4123 3.70994ZM5.79264 7.82581H3.37914C3.01337 7.82581 2.66258 7.97111 2.40394 8.22975C2.1453 8.48839 2 8.83918 2 9.20495V14.7215C2 15.0873 2.1453 15.4381 2.40394 15.6967C2.66258 15.9554 3.01337 16.1007 3.37914 16.1007H5.79264C5.88408 16.1007 5.97178 16.0643 6.03644 15.9997C6.1011 15.935 6.13742 15.8473 6.13742 15.7559V8.1706C6.13742 8.07915 6.1011 7.99146 6.03644 7.9268C5.97178 7.86214 5.88408 7.82581 5.79264 7.82581ZM16.7197 9.62214C16.6516 9.68198 16.596 9.75466 16.556 9.83602C16.5161 9.91738 16.4925 10.0058 16.4868 10.0963C16.481 10.1868 16.4931 10.2775 16.5224 10.3632C16.5518 10.449 16.5977 10.5282 16.6577 10.5962C16.9903 10.9739 17.1738 11.4599 17.1738 11.9632C17.1738 12.4665 16.9903 12.9526 16.6577 13.3303C16.5961 13.398 16.5486 13.4772 16.518 13.5634C16.4873 13.6495 16.4741 13.741 16.4791 13.8323C16.4842 13.9236 16.5073 14.013 16.5472 14.0953C16.5871 14.1777 16.643 14.2512 16.7116 14.3117C16.7802 14.3722 16.8602 14.4184 16.9469 14.4477C17.0335 14.477 17.1251 14.4887 17.2164 14.4823C17.3076 14.4758 17.3967 14.4513 17.4783 14.4101C17.56 14.3689 17.6326 14.3118 17.692 14.2423C18.2467 13.6126 18.5527 12.8023 18.5527 11.9632C18.5527 11.1241 18.2467 10.3138 17.692 9.6842C17.6322 9.61598 17.5595 9.56025 17.478 9.52019C17.3966 9.48014 17.308 9.45655 17.2175 9.45078C17.1269 9.44502 17.0361 9.45719 16.9502 9.48659C16.8644 9.516 16.7852 9.56206 16.7172 9.62214H16.7197ZM20.2443 7.36639C20.185 7.29547 20.112 7.2372 20.0297 7.19507C19.9474 7.15293 19.8574 7.12777 19.7652 7.1211C19.673 7.11443 19.5803 7.12637 19.4928 7.15623C19.4053 7.18608 19.3247 7.23322 19.2558 7.29487C19.1868 7.35651 19.131 7.43138 19.0916 7.51503C19.0522 7.59869 19.03 7.68941 19.0264 7.78181C19.0228 7.8742 19.0378 7.96639 19.0705 8.05287C19.1032 8.13936 19.153 8.21838 19.2168 8.28524C20.1216 9.29669 20.6219 10.6062 20.6219 11.9632C20.6219 13.3203 20.1216 14.6298 19.2168 15.6412C19.153 15.7081 19.1032 15.7871 19.0705 15.8736C19.0378 15.9601 19.0228 16.0523 19.0264 16.1447C19.03 16.2371 19.0522 16.3278 19.0916 16.4114C19.131 16.4951 19.1868 16.57 19.2558 16.6316C19.3247 16.6932 19.4053 16.7404 19.4928 16.7702C19.5803 16.8001 19.673 16.812 19.7652 16.8054C19.8574 16.7987 19.9474 16.7735 20.0297 16.7314C20.112 16.6893 20.185 16.631 20.2443 16.5601C21.3749 15.2959 22 13.6593 22 11.9632C22 10.2672 21.3749 8.63061 20.2443 7.36639Z"
                                                fill="#007C8F" />
                                        </svg>
                                        <svg x-bind:class="volume==0?'block':'hidden'" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            class="block">
                                            <path
                                                d="M21.7979 13.5452C21.9273 13.6746 22 13.8501 22 14.0331C22 14.2161 21.9273 14.3916 21.7979 14.521C21.6685 14.6504 21.493 14.7231 21.31 14.7231C21.127 14.7231 20.9515 14.6504 20.8221 14.521L19.241 12.9391L17.66 14.521C17.5306 14.6504 17.3551 14.7231 17.1721 14.7231C16.9891 14.7231 16.8136 14.6504 16.6842 14.521C16.5548 14.3916 16.4821 14.2161 16.4821 14.0331C16.4821 13.8501 16.5548 13.6746 16.6842 13.5452L18.2661 11.9642L16.6842 10.3832C16.5548 10.2538 16.4821 10.0782 16.4821 9.89524C16.4821 9.71223 16.5548 9.53672 16.6842 9.40732C16.8136 9.27791 16.9891 9.20521 17.1721 9.20521C17.3551 9.20521 17.5306 9.27791 17.66 9.40732L19.241 10.9892L20.8221 9.40732C20.9515 9.27791 21.127 9.20521 21.31 9.20521C21.493 9.20521 21.6685 9.27791 21.7979 9.40732C21.9273 9.53672 22 9.71223 22 9.89524C22 10.0782 21.9273 10.2538 21.7979 10.3832L20.216 11.9642L21.7979 13.5452ZM5.79303 7.82631H3.37928C3.01348 7.82631 2.66265 7.97163 2.40398 8.2303C2.14532 8.48896 2 8.83979 2 9.2056V14.7227C2 15.0885 2.14532 15.4394 2.40398 15.698C2.66265 15.9567 3.01348 16.102 3.37928 16.102H5.79303C5.88448 16.102 5.97219 16.0657 6.03686 16.001C6.10152 15.9364 6.13785 15.8486 6.13785 15.7572V8.17113C6.13785 8.07968 6.10152 7.99198 6.03686 7.92731C5.97219 7.86264 5.88448 7.82631 5.79303 7.82631ZM14.1679 3.1583C14.0471 3.0584 13.896 3.0026 13.7393 3.00009C13.5826 2.99758 13.4297 3.04852 13.3058 3.14451L7.65334 7.54098C7.61141 7.57283 7.57733 7.61387 7.55372 7.66094C7.53011 7.70801 7.5176 7.75986 7.51714 7.81252V16.1158C7.51729 16.1683 7.52941 16.22 7.55256 16.267C7.57572 16.3141 7.6093 16.3552 7.65075 16.3874L13.3032 20.7838C13.4127 20.8689 13.5453 20.9191 13.6837 20.9277C13.8221 20.9363 13.9599 20.903 14.0791 20.8321C14.184 20.7669 14.2701 20.6755 14.3292 20.5671C14.3883 20.4586 14.4182 20.3366 14.4161 20.2131V3.71001C14.4174 3.60527 14.3956 3.50153 14.3523 3.40617C14.3089 3.31082 14.2451 3.22618 14.1653 3.1583H14.1679Z"
                                                fill="#007C8F"></path>
                                        </svg>
                                    </div>
                                </div>
                                <audio class="hidden" x-ref="audioElement" @timeupdate="updateProgress()"
                                    @loadedmetadata="loadMetadatafn()" @volumeChange="updateVolume()"
                                    @ended="isPlaying = false" src=${audioUrl} controls></audio>
                            </div>
                            `;
                previewContainer.innerHTML = audioPlayerHTML;
                Alpine.initTree(previewContainer);

            }

            else if (file.type.startsWith('video')) {
                // Show video player

                const videoUrl = URL.createObjectURL(file);
                previewContainer.classList.remove('hidden');
                previewContainer.innerHTML = '';
                const videoPlayerHTML = `
                            <video class="w-full h-[450px]" controls>
                                <source src="${videoUrl}" type="${file.type}">
                                `;
                previewContainer.innerHTML = videoPlayerHTML;



            }

            else {

                const documentURl = URL.createObjectURL(file);

                previewContainer.classList.remove('hidden');
                previewContainer.innerHTML = '';
                const otherFileHTML = `<span
                                    class="bg-[#c7e6e6] text-[#007c82] p-4  rounded flex items-center justify-between">
                                    <span class="flex items-center gap-x-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M20.6981 7.60962L15.3135 2.225C15.242 2.15359 15.1571 2.09696 15.0637 2.05836C14.9704 2.01975 14.8703 1.99992 14.7692 2H5.53846C5.13044 2 4.73912 2.16209 4.4506 2.45061C4.16209 2.73912 4 3.13044 4 3.53846V20.4615C4 20.8696 4.16209 21.2609 4.4506 21.5494C4.73912 21.8379 5.13044 22 5.53846 22H19.3846C19.7926 22 20.184 21.8379 20.4725 21.5494C20.761 21.2609 20.9231 20.8696 20.9231 20.4615V8.15385C20.9232 8.0528 20.9033 7.95273 20.8647 7.85935C20.8261 7.76597 20.7695 7.68111 20.6981 7.60962ZM15.5385 16.6154H9.38462C9.1806 16.6154 8.98495 16.5343 8.84069 16.3901C8.69643 16.2458 8.61538 16.0502 8.61538 15.8462C8.61538 15.6421 8.69643 15.4465 8.84069 15.3022C8.98495 15.158 9.1806 15.0769 9.38462 15.0769H15.5385C15.7425 15.0769 15.9381 15.158 16.0824 15.3022C16.2266 15.4465 16.3077 15.6421 16.3077 15.8462C16.3077 16.0502 16.2266 16.2458 16.0824 16.3901C15.9381 16.5343 15.7425 16.6154 15.5385 16.6154ZM15.5385 13.5385H9.38462C9.1806 13.5385 8.98495 13.4574 8.84069 13.3132C8.69643 13.1689 8.61538 12.9732 8.61538 12.7692C8.61538 12.5652 8.69643 12.3696 8.84069 12.2253C8.98495 12.081 9.1806 12 9.38462 12H15.5385C15.7425 12 15.9381 12.081 16.0824 12.2253C16.2266 12.3696 16.3077 12.5652 16.3077 12.7692C16.3077 12.9732 16.2266 13.1689 16.0824 13.3132C15.9381 13.4574 15.7425 13.5385 15.5385 13.5385ZM14.7692 8.15385V3.92308L19 8.15385H14.7692Z"
                                                fill="#007C8F" />
                                        </svg>
                                        ${file.name}
                                    </span>
                                    <span>
                                        <svg id="previewTheFileInNextTab" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21.9425 11.3967C21.9133 11.3308 21.2075 9.765 19.6383 8.19584C17.5475 6.105 14.9067 5 12 5C9.09333 5 6.4525 6.105 4.36166 8.19584C2.79249 9.765 2.08333 11.3333 2.05749 11.3967C2.01959 11.4819 2 11.5742 2 11.6675C2 11.7608 2.01959 11.8531 2.05749 11.9383C2.08666 12.0042 2.79249 13.5692 4.36166 15.1383C6.4525 17.2283 9.09333 18.3333 12 18.3333C14.9067 18.3333 17.5475 17.2283 19.6383 15.1383C21.2075 13.5692 21.9133 12.0042 21.9425 11.9383C21.9804 11.8531 22 11.7608 22 11.6675C22 11.5742 21.9804 11.4819 21.9425 11.3967ZM12 15C11.3407 15 10.6963 14.8045 10.1481 14.4382C9.59993 14.072 9.17269 13.5514 8.9204 12.9423C8.66811 12.3332 8.6021 11.663 8.73071 11.0164C8.85933 10.3698 9.1768 9.77582 9.64298 9.30965C10.1092 8.84347 10.7031 8.526 11.3497 8.39738C11.9963 8.26877 12.6665 8.33478 13.2756 8.58707C13.8847 8.83936 14.4053 9.26661 14.7716 9.81477C15.1378 10.3629 15.3333 11.0074 15.3333 11.6667C15.3333 12.5507 14.9821 13.3986 14.357 14.0237C13.7319 14.6488 12.8841 15 12 15Z"
                                                fill="#007C8F" />
                                        </svg>
                                    </span>
                                </span>`;
                previewContainer.innerHTML = otherFileHTML;
            }
        } else {
            // Hide container when no file selected
            previewContainer.classList.add('hidden');
        }
    }
