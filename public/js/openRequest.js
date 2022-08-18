const spinner = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`
const openedSelect = `<div class="options"><select class="select" id="opendWhs"></select><div id="openOutBtuDiv"><div class="btu" id="closeBtu">Close</div><div class="btu" id="closeAllBtu">Close All</div></div></div>`
const closedSelect = `<div class="options"><select class="select" id="closedWhs"></select><div id="closeOutBtuDiv"><div class="btu" id="openBtu">Open</div></div></div>`
$(document).ready(() => {
    getInfo()
})

const getInfo = () => {
    $.get('/warehouses-info').then((data) => {
        if(data != "error"){
            const allowedWhs = []
            const notAllowedWhs = []
            console.log(data)
            data.forEach(whs => {
                if(whs.Allowed == "0"){
                    notAllowedWhs.push({
                        name:whs.WarehouseName,
                        code:whs.WhsCode
                    })
                }else{
                    allowedWhs.push({
                        name:whs.WarehouseName,
                        code:whs.WhsCode
                    })
                }
            })
            let opts;
            $('#closed').html(closedSelect)
            opts = getOptions(notAllowedWhs)
            $('#closedWhs').html(opts)
            $('#opend').html(openedSelect)
            opts = getOptions(allowedWhs)
            $('#opendWhs').html(opts)
            $("#closeBtu").on('click',() => {
                change("close")
            })
            $("#closeAllBtu").on('click',() => {
                change("closeAll")
            })
            $("#openBtu").on('click',() => {
                change("open")
            })
        }else{
            $('#closed').html()
            $('#opend').html()
            alert(`لا يوجد اتصال بالانترنت`)
        }
    })
}

const getOptions = (data) => {
    let opts = ''
    data.forEach(opt => {
        opts += `<option id=${opt.code}>${opt.name}</option>`
    })
    return opts
}

const change = (type) => {
    const openedOption = $('#opendWhs').find(":selected")
    const closedOption = $('#closed').find(":selected")
    let id;
    if(type != "open"){
        if(closedOption[0]){
            showModal("spinner")
            if(type == "close"){
                id = closedOption[0].id
            }else{
                id = "null"
            }
            $.post(`/change-allow/${type}/${id}`)
            .then((msg) => {
                if(msg == "done"){
                    setTimeout(() => {
                        hideModal("spinner")
                        refresh()
                    }, 200)
                }else{
                    alert(`لا يوجد اتصال بالانترنت`)
                }
            })
        }
    }else{
        if(openedOption[0]){
            showModal("spinner")
            id = openedOption[0].id
            $.post(`/change-allow/${type}/${id}`)
            .then((msg) => {
                if(msg == "done"){
                    setTimeout(() => {
                        hideModal("spinner")
                        refresh()
                    }, 200)
                }else{
                    alert(`لا يوجد اتصال بالانترنت`)
                }
            })
        }
    }
}

const refresh = () => {
    $('#closed').html(spinner)
    $('#opend').html(spinner)
    setTimeout(() => {
        getInfo()
    }, 200)
}

const showModal = (type) => {
    $("#demo-modal").removeClass("modal");
    $("#demo-modal").addClass("modal-v");
    switch (type) {
        case "spinner":
            $(".modal_spinner_container").attr("style", "display:flex;height: 100%;width: 100%;");
            break;
        default:
            break;
    }
  };
  
  const hideModal = (type) => {
    $("#demo-modal").removeClass("modal-v");
    $("#demo-modal").addClass("modal");
    switch (type) {
        case "spinner":
            $(".modal_spinner_container").attr("style", "display:none;");
            break;
      default:
            break;
    }
  };