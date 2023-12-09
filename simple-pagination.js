/*
  페이지네이션을 만듭니다. 설정값을 입력하면 페이지번호들이 화면에 나타납니다.
  나오는 레이아웃은 아무런 css를 입히지 않았습니다. 이유는, css를 자유롭고 편하게 수정할 수 있게 하기 위함입니다.
  사용 예시
    makePagination({
        targetSelector:".pagination",
        pageNo: 3,
        totalArticleCnt:62,
        pageHolderClasses:"list",
        pageItemClasses:"item",
        usePrevBtnImage: true,
        prevBtnImagePath:"/org/img/pagination-prev-btn.png",
        useNextBtnImage: true,
        prevBtnImageClasses:"arrow",
        nextBtnImagePath:"/org/img/pagination-next-btn.png",
        nextBtnImageClasses:"arrow",
        onClickPage: clickedPageNo => {
            const keyword = new URLSearchParams(window.location.search).get("keyword");
            location.href = `./trd.php?keyword=${keyword}&pageNo=${clickedPageNo}`;
        }
    });
*/
const makePagination = (
    {targetSelector, pageNo = 1, pagesPerBlock = 5, totalArticleCnt = 0, articlesPerPage = 10, 
    pageItemClasses, prevBtnClasses, nextBtnClasses, currentPageClasses = "current", pageHolderClasses,
    usePrevBtnImage = false, prevBtnChar = "&lt;", prevBtnImagePath, prevBtnImageClasses, 
    useNextBtnImage = false, nextBtnChar = "&gt;", nextBtnImagePath, nextBtnImageClasses,
    onClickPage}) => {
    if(pageNo < 0){
        return;
    }
    if(totalArticleCnt == 0){
        return;
    }
    drawPagination({_pageNo: pageNo});
    function drawPagination({_pageNo}){
        // 6 % 5 = 1        // 나머지가 1 이상이면
        // 6 - 1 = 5        // 현재 페이지에서 나머지값을 뺀 후 1 증가
        // ++   
        // 6                // start num 값 구함
        // 6 - 1 + 5 = 10   // start - 1 + block 값 = 블록 내의 마지막 페이지 값
        // 7 % 5 = 2        
        // 7 - 2 = 5
        // ++
        // 6
        // 6 - 1 + 5 = 10
        // 15 % 5 = 0       // 나머지가 0이면 블록 마지막 페이지를 가리키므로
        // 15 - 5 = 10      // 현재 페이지에서 블록 페이지 단위만큼 뺀 후 1 증가
        // ++           
        // 11               // start num 값 구함
        // 11 -1 + 5 = 15
        // 페이장 10개의 글, row수 280이면, 2총 28페이지
        // 현재블록 최대 페이지 수 25이면 25 < 28, '다음' 버튼 추가
        // row 수가 240이고 현재 블록 최대 페이지 수가 25면,
        // 25 < 24
        // 현재 블록 최대 페이지 수를 24로 바꾸고 "다음" 버튼 제거
        // 3 / 5 < 1        // 현재 페이지 / 블록 페이지 단위
        // 5 / 5 = 1        // 현재 블록일 경우 1이하임을 확인 할 수 있음
        // 11 / 5 > 1       // 두 번째 블록부터 1초과
                            // 첫번째 블록일 경우 '이전' 버튼 제거
        let pageStartNum = _pageNo % pagesPerBlock;
        if(pageStartNum > 0){
            pageStartNum = _pageNo - pageStartNum + 1;
        }else if(pageStartNum == 0){
            pageStartNum = _pageNo - pagesPerBlock + 1;
        }else{
            console.log("페이지네이션 오류");
            return;
        }
        let pageEndNum = pageStartNum + pagesPerBlock - 1;
        const totalPages = Math.floor(totalArticleCnt / articlesPerPage) + ((totalArticleCnt % articlesPerPage > 0)? 1 : 0) ; 
        let enableNextBtn = true; 
        let nextBtnPageNo = pageEndNum + 1;
        if(pageEndNum > totalPages){
            pageEndNum = totalPages;
            nextBtnPageNo = -1;
            enableNextBtn = false;
        }
        let enablePrevBtn = true;
        let prevBtnPageNo = pageStartNum - 1;
        if(_pageNo / pagesPerBlock <= 1){
            enablePrevBtn = false;
            prevBtnPageNo = -1;
        }
        const ul = $("<ul></ul>");
        if(typeof pageHolderClasses != "undefined"){
            addCssClasses(ul, pageHolderClasses);
        }
        if(enablePrevBtn){
            const li = $("<li></li>");
            $(li).attr("data-page-no", prevBtnPageNo);        
            addCssClasses(li, prevBtnClasses);
            if(!usePrevBtnImage){
                li.html(prevBtnChar);
            }else{
                const img = $(`<img src="${prevBtnImagePath}" alt="${prevBtnImagePath}" />`)
                if(typeof prevBtnImageClasses != "undefined"){
                    addCssClasses(img, prevBtnImageClasses);
                }
                li.append(img);
            }
            ul.append(li);
        }
        for(let i = pageStartNum; i <= pageEndNum; i++){
            const li = $("<li></li>");
            $(li).attr("data-page-no", i);        
            addCssClasses(li, pageItemClasses);
            li.html(i);
            ul.append(li);
            if(i == _pageNo){
                addCssClasses(li, currentPageClasses);
            }
        }
        if(enableNextBtn){
            const li = $("<li></li>");
            $(li).attr("data-page-no", nextBtnPageNo);        
            addCssClasses(li, nextBtnClasses);
            if(!useNextBtnImage){
                li.html(nextBtnChar);
            }else{
                const img = $(`<img src="${nextBtnImagePath}" alt="${nextBtnImagePath}" />`)
                if(typeof nextBtnImageClasses != "undefined"){
                    addCssClasses(img, nextBtnImageClasses);
                }
                li.append(img);
            }
            ul.append(li);
        }
        $(targetSelector).empty();
        $(targetSelector).append(ul);
        $(ul).find("li").each(function(_, li){
            $(li).on("click", function(){
                const selectedPageNo = $(this).attr("data-page-no");
                onClickPage(selectedPageNo);
            });
        });
    }
    function addCssClasses(el, classes){
        if(typeof classes != "undefined"){
            const classArr = classes.split(" ");
            classArr.forEach(cls => $(el).addClass(cls));
        }
    }
    return {
        redrawPagination : (newPageNo) => {
            drawPagination({_pageNo: newPageNo});
        }
    };
};