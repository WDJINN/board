$(function(){
  function get2digits(num){
    return ('0'+num).slice(-2);
  }

  function getDate(dateObj){
    if(dateObj instanceof Date)
      return dateObj.getFullYear()+'-'+get2digits(dateObj.getMonth()+1)+'-'+get2digits(dateObj.getDate());
  }

  function getTime(dateObj){
    if(dateObj instanceof Date)
      return get2digits(dateObj.getHours())+':'+get2digits(dateObj.getMinutes())+':'+get2digits(dateObj.getSeconds());
  }

  function convertDate(){
    $('[data-date]').each(function(index, element){
      const dateString = $(element).data('date');
      if(dateString){
        const date = new Date(dateString);
        $(element).html(getDate(date));
      }
    });
  }

  function convertDateTime(){
    $('[data-date-time]').each(function(index, element){
      const dateString = $(element).data('date-time');
      if(dateString){
        const date = new Date(dateString);
        $(element).html(getDate(date)+' '+getTime(date));
      }
    });
  }

  convertDate();
  convertDateTime();
});


$(function(){
  const search = window.location.search;
  const params = {};

  if(search){
    $.each(search.slice(1).split('&'), function(index, param){
      var index = param.indexOf('=');
      if(index>0){
        const key = param.slice(0, index);
        const value = param.slice(index+1);

        if(!params[key]) params[key] = value;
      }
    });
  }
  if(params.searchText && params.searchText.length>=3){
    $('[data-search-highlight]').each(function(index,element){
      const $element = $(element);
      const searchHighlight = $element.data('search-highlight');
      var index = params.searchType.indexOf(searchHighlight);

      if(index>=0){
        let decodedSearchText = params.searchText.replace(/\+/g,' ');
        decodedSearchText = decodeURI(decodedSearchText);

        const regex = new RegExp(`(${decodedSearchText})`,'ig');
        $element.html($element.html().replace(regex, '<span class="highlighted">$1</span>'));
      }
    });
  }
});

$(function(){
  function resetTitleEllipsisWidth(){
    $('.board-table .title-text').each(function(i,e){
      var $text = $(e);
      var $ellipsis = $(e).closest('.title-ellipsis');
      var $comment = $(e).closest('.title-container').find('.title-comments');

      if($comment.length == 0) return;

      var textWidth = $text.width();
      var ellipsisWidth = $ellipsis.outerWidth();
      var commentWidth = $comment.outerWidth();
      var padding = 1;

      if(ellipsisWidth <= (textWidth+commentWidth+padding)){
        $ellipsis.width(ellipsisWidth-(commentWidth+padding));
      }
      else {
        $ellipsis.width(textWidth+padding);
      }
    });
  }
  $(window).resize(function(){
    $('.board-table .title-ellipsis').css('width','');
    resetTitleEllipsisWidth();
  });
  resetTitleEllipsisWidth();
});