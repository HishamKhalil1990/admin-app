$(document).ready(() => {
    $('#whsSendBtu').on('click',()=>{
        const whs = $('.input-po').val()
        if(whs != ""){
            localStorage.setItem("whs",whs);
            const data = `<div><a style="color: white;" href="/Sales/report" id="goReport">press</a></div>`
            goDirect('goReport',data)
        }else{
          alert('الرجاء ادخال رقم المستودع')
        }
    });
    $('#goBackBtu').on('click',()=>{
        goToPage('goTransaction')
    });
    $('#goHomeBtu').on('click',()=>{
        goToPage('goTransaction')
    });
})

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


  const goDirect = (page,data) => {
    $('#body').html(data)
    document.getElementById(`${page}`).click();
  }