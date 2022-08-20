const select = `<select name="warehouse" id="selectWhs"></select>`
const buttons = `<button id="btuSubmit" class="btu">ارسال</button><button id="btuClose" class="btu">اغلاق</button>`
const spinner = `<div id="spinnerOutter"><div id="spinnerInner" ><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div></div>` 
let reportOpened = false
let note = ""
let counter;
let all = false
$(document).ready(() => {
    $.get('/warehouses').then((data) => {
        if(data != "error"){
            const opts = getOptions(data)
            $('#selectPlace').html(select)
            $('#selectWhs').html(opts)
        }else{
            $('#selectPlace').empty()
            showModal('noEnternet')
            setTimeout(() => {
                hideModal("noEnternet")
            },1500)
        }
    })
    $('#btuSearch').on('click',() => {
        counter = 0
        goAndSearch()
    })
    $('#btuShow').on('click',() => {
        goAndAdd()
    })
    $('#btuSend').on('click',() => {
        const name = $('#addName')[0].value
        const date = $('#addDate')[0].value
        if((name != "") && (date != "")){
            showModal("notes")
        }else if((name == "") && (date == "")){
            alert(`الرجاء ادخال اسم وتاريخ الجرد`)
        }else if(name == ""){
            alert(`الرجاء ادخال اسم الجرد`)
        }else if(date == ""){
            alert(`الرجاء ادخال تاريخ الجرد`)
        }
    })
    $(".closeAdd_btu").on("click", () => {
        hideModal("notes");
      });
      $(".add_btu").on("click", () => {
        hideModal("notes");
        let text = document.getElementById('textArea').value
        if(text == ""){
          note = "لايوجد"
        }else{
          note = text
        }
        document.getElementById('textArea').value = ""
        showModal("spinner")
        goAndSend();
    });
    $('#btuAll').on('click',() => {
        $("#reportDiv").empty()
        reportOpened = false
        $('#tablePlace').html(spinner)
        if(!all){
            selectAll()
        }else{
            removeAll()
        }
    })
})

const getOptions = (data) => {
    let opts = ''
    data.forEach(opt => {
        opts += `<option id=${opt.WhsCode}>${opt.WhsName}</option>`
    })
    return opts
}

const changeCheck = (id,skip) => {
    const tr = $(`#tr-${id}`)
    const checkbox = document.querySelector(`#input-${id}`)
    let state;
    if(skip){
        state = !checkbox.checked
    }else{
        state = checkbox.checked
        checkbox.checked = !state
    }
    if(state){
        removeActive(tr,id)
    }else{
        addActive(tr,id)
    }
}

const removeActive = (tr,id) => {
    const count = 0
    $.post(`/check/${id}/false/${count}`).then((msg) => {
        if(msg != 'error'){
            tr.attr('style','background-color:""')
            if(reportOpened){
                goAndAdd()
            }
        }else{
            alert('حصل خطا داخلي الرجاء المحاولة مرة اخرى')
        }
    })
}

const addActive = (tr,id) => {  
    counter += 1
    $.post(`/check/${id}/true/${counter}`).then((msg) => {
        if(msg != 'error'){
            tr.attr('style','background-color:green')
            if(reportOpened){
                goAndAdd()
            }
        }else{
            alert('حصل خطا داخلي الرجاء المحاولة مرة اخرى')
        }
    })
}

const goAndSearch = () => {
    $("#reportDiv").empty()
    reportOpened = false
    $('#tablePlace').html(spinner)
    const option = $('#selectWhs').find(":selected")
    const id = option[0].id
    $.get(`/create-table/${id}`).then((data) => {
        if((data != "error") && (data != "noData")){
            createTable(data)
        }else if(data == "error"){
            $('#tablePlace').empty()
            alert('حصل خطا داخلي الرجاء المحاولة مرة اخرى')
        }else if(data == "noData"){
            $('#tablePlace').empty()
            showModal('noEnternet')
            setTimeout(() => {
                hideModal("noEnternet")
            },1500)
        }
    })
}

const goAndAdd = () => {
    $.get('/report').then((data) => {
        if(data != 'error'){
            $("#reportDiv").html(data)
            reportOpened = true
            $('#btuClose').on('click',() => {
                $("#reportDiv").empty()
                reportOpened = false
            })
        }else{
            alert('حصل خطا داخلي الرجاء المحاولة مرة اخرى')
        }
    })
}

const goAndSend = () => {
    const name = $('#addName')[0].value
    const date = $('#addDate')[0].value
    console.log(`/send/${date}/${name}/${note}`)
    $.post(`/send/${date}/${name}/${note}`).then((msg) => {
        if(msg == 'done'){
            hideModal("spinner");
            setTimeout(() => {
                alert(`تم الارسال`)
                refreshPage()
            },100)
        }else if(msg == 'error'){
            hideModal("spinner");
            showModal('noEnternet')
            setTimeout(() => {
                hideModal("noEnternet")
            },1500)
        }else if(msg == 'noData'){
            hideModal("spinner");
            alert(`لا يوجد بيانات للارسال`)
        }
    })
}

const refreshPage = () => {
    location.reload();
}

const showModal = (type) => {
    $("#demo-modal").removeClass("modal");
    $("#demo-modal").addClass("modal-v");
    switch (type) {
      case "notes":
        $(".modal_notes_container").attr("style", "display:flex;");
        break;
      case "spinner":
        $(".modal_spinner_container").attr("style", "display:flex;");
        break;
      case "noEnternet":
        $(".modal_notAllowed_container").attr("style", "display:flex;");
        break;
      default:
        break;
    }
  };
  
  const hideModal = (type) => {
    $("#demo-modal").removeClass("modal-v");
    $("#demo-modal").addClass("modal");
    switch (type) {
      case "notes":
        $(".modal_notes_container").attr("style", "display:none;");
        break;
      case "spinner":
        $(".modal_spinner_container").attr("style", "display:none;");
        break;
      case "noEnternet":
        $(".modal_notAllowed_container").attr("style", "display:none;");
        break;
      default:
        break;
    }
  };

  const createTable = (data) => {
    setTimeout(() => {
        $('#tablePlace').html(data)
        $("#example").DataTable();
        document.getElementById('tbody').addEventListener('click',(e) => {
            const fullID = e.target.className
            if(fullID != "check-box"){
                const id = fullID.split('-')[1].split(" ")[0]
                changeCheck(id,false)
            }else{
                const id = e.target.id.split('-')[1].split(" ")[0]
                changeCheck(id,true)
            }
        })
    },300)
  }

const selectAll = () => {
    $.post('/select-all/true').then((data) => {
        if(data != 'error'){
            all = true
            createTable(data)
        }else{
            alert('حصل خطا داخلي الرجاء المحاولة مرة اخرى')
        }
    })
  }

const removeAll = () => {
    $.post('/select-all/false').then((data) => {
        if(data != 'error'){
            all = false
            createTable(data)
        }else{
            alert('حصل خطا داخلي الرجاء المحاولة مرة اخرى')
        }
    })
  }