let whs;
let fromDate;
let toDate;
$(document).ready(function () {
    whs = localStorage.getItem("whs")
    let today = new Date()
    today = today.toISOString().split('T')[0]
    const arr = today.split('-')
    let toDay = parseInt(arr[2]) == 1? '01' : `${parseInt(arr[2]) - 1}`
    toDay = toDay.length == 1? '0' + toDay : toDay
    fromDate = arr[0] + '-' + arr[1] + '-01'
    toDate = arr[0] + '-' + arr[1] + '-' + toDay
    document.getElementById("start").defaultValue = fromDate
    document.getElementById("end").defaultValue = toDate
    fromDate = new Date(fromDate)
    fromDate = fromDate.toISOString().split('T')[0]
    toDate = new Date(toDate)
    toDate = toDate.toISOString().split('T')[0]
    syncData(fromDate,toDate)
    $("#reportSearch").on("click", () => {
        const start = $("#start").val()
        const end = $("#end").val()
        syncData(start,end)
    });
    $('#goBackBtu').on('click',()=>{
        goToPage('goSalesWhs')
    });
    $('#goHomeBtu').on('click',()=>{
        goToPage('goTransaction')
    });
})

const syncData = (start,end) => {
  showModal('waiting')
  if(start && end){
    if((Date.parse(start) >= Date.parse(fromDate)) && (Date.parse(end) <= Date.parse(toDate))){
      if(Date.parse(start) <= Date.parse(end)){
          $.post(`/Sales/data/${start}/${end}/${whs}`).then(data => {
              if(data != 'error'){
                  $('#reportTable').html(data)
                  hideModal('waiting')
              }else{
                  $('#reportTable').html("")
                  hideModal('waiting')
                  alert("الرجاء حاول مرة اخرى");
              }
          })
       }else{
          hideModal('waiting')
          alert('تاريخ النهاية اقدم من تاريخ البداية')
       }
    }else{
      hideModal('waiting')
      alert(`الرجاء استخدام تواريخ بين ${fromDate} و ${toDate}`)
    }
  }else{
      hideModal('waiting')
      alert('الرجاء ادخال جميع التواريخ المطلوبة')
  }
}


const showModal = (type) => {
    $("#demo-modal").removeClass("modal");
    $("#demo-modal").addClass("modal-v");
    switch (type) {
      case "waiting":
        $(".modal_waiting_container").attr("style", "display:flex;");
        break;
      default:
        break;
    }
  };
  
  const hideModal = (type) => {
    $("#demo-modal").removeClass("modal-v");
    $("#demo-modal").addClass("modal");
    switch (type) {
      case "waiting":
        $(".modal_waiting_container").attr("style", "display:none;");
        break;
      default:
        break;
    }
  }

  const goToPage = (page) => {
    $.get('/Routing').then(data => {
      $('#body').html(data)
      $(document).ready(function() {
          setTimeout(() => {
              document.getElementById(`${page}`).click();
          },1000)
      })
    });
  }