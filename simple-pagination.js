
/*
  페이지네이션을 만듭니다. 설정값을 입력하면 페이지번호들이 화면에 나타납니다.
  나오는 레이아웃은 아무런 css를 입히지 않았습니다. 이유는, css를 자유롭고 편하게 수정할 수 있게 하기 위함입니다.

  사용 예시

  makePagination({
    targetSelector:".pagination",
    pageNo:3,
    totalArticleCnt: 253,
    pageItemClasses:"font13 color-black font-regular item",
    prevBtnClasses:"font13 color-black font-regular item",
    nextBtnClasses:"font13 color-black font-regular item",
    pageHolderClasses:"list",
    onClickPage: pageNo => {
        location.href = `/some-url?pageNo=${pageNo}&otherQueryParams=value`;
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

    // 22 % 4 = 2
    // 22 - 2 = 20
    // 20 + 4 = 24
    
    // 19 % 3 = 1
    // 19 - 1 = 18
    // 18 + 3 = 21

    // 15 % 5 = 0
    // 15 - 0 = 15
    // 15 + 5 = 20
    // 1p 10, row수 280이면, 28.
    // 24 < 28, '다음' 버튼 추가
    // p: row 수 172면, (172 / 10)  + (172 % 10)>0? 1 : 0  q: 18
    // 24 > 18, 20은 18로 대체되고 '다음' 버튼 제거
    // p: 15 / 5 = 3, 3 / 5 < 1 q: 첫 페이지블록을 넘어서는 조건은 pageNo와 pagesPerBlock을 나누어서 1이 안넘으면 첫번쨰 블록이고 넘으면 두번째 이상 블록.
    // 두번째 이상 블록이면, '이전' 버튼 생성
    // 그리고, 계산 다하고 pageStartNum은 +1 해줘야 함. 0부터 시작하거나, 이전블록 pageNum을 가리키기 떄문에.
    
 

    let pageStartNum = pageNo % pagesPerBlock;
    pageStartNum = pageNo - pageStartNum;

    let pageEndNum = pageStartNum + pagesPerBlock;
    const totalPages = Math.floor(totalArticleCnt / articlesPerPage) + ((totalArticleCnt % articlesPerPage > 0)? 1 : 0) ; 

    let enableNextBtn = true; 
    let nextBtnPageNo = pageEndNum + 1;

    if(pageEndNum > totalPages){
        pageEndNum = totalPages;
        nextBtnPageNo = pageEndNum + 1; // 재설정
        enableNextBtn = false;
    }

    let enablePrevBtn = true;
    let prevBtnPageNo = pageStartNum - 1;

    if(pageNo / pagesPerBlock < 1){
        enablePrevBtn = false;
    }

    pageStartNum++;



 


    const ul = $("<ul></ul>");

    if(typeof pageHolderClasses != "undefined"){
        addCssClasses(ul, pageHolderClasses);
    }
    
    if(enablePrevBtn){
        const li = $("<li></li>");

        $(li).attr("data-page-no", prevBtnPageNo);        

        addCssClasses(li, prevBtnClasses);
        
        if(!usePrevBtnImage){
            li.append(prevBtnChar);
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
        li.append(i);
        ul.append(li);

        if(i == pageNo){
            addCssClasses(li, currentPageClasses);
        }
    }
    
    if(enableNextBtn){
        const li = $("<li></li>");

        $(li).attr("data-page-no", nextBtnPageNo);        

        addCssClasses(li, nextBtnClasses);
        
        if(!useNextBtnImage){
            li.append(nextBtnChar);
        }else{
            const img = $(`<img src="${nextBtnImagePath}" alt="${nextBtnImagePath}" />`)
            if(typeof nextBtnImageClasses != "undefined"){
                addCssClasses(img, nextBtnImageClasses);
            }
            li.append(img);
        }

        ul.append(li);
    }
   
    $(targetSelector).append(ul);
    
    $(ul).find("li").each(function(_, li){
        $(li).on("click", function(){
            const selectedPageNo = $(this).attr("data-page-no");
            onClickPage(selectedPageNo);
        });
    });

    function addCssClasses(el, classes){
        if(typeof classes != "undefined"){
            const classArr = classes.split(" ");
            classArr.forEach(cls => $(el).addClass(cls));
        }
    }
};