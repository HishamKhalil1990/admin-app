const spinner = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`
const openedSelect = `<div class="options"><select class="select" id="opendWhs"></select><div id="openOutBtuDiv"><div class="btu" id="closeBtu">Close</div><div class="btu" id="closeAllBtu">Close All</div></div></div>`
const closedSelect = `<div class="options"><select class="select" id="closedWhs"></select><div id="closeOutBtuDiv"><div class="btu" id="openBtu">Open</div></div></div>`
$(document).ready(() => {
    getInfo()
    $('#goBackBtu').on('click',()=>{
        const data = `<div><a style="color: white;" href="/choose" id="goChoose">press</a></div>`
        goDirect('goChoose',data)
    });
    $('#goHomeBtu').on('click',()=>{
        const data = `<div><a style="color: white;" href="/choose" id="goChoose">press</a></div>`
        goDirect('goChoose',data)
    });
    $('#refresh').on('click',()=>{
        location.reload();
    });  
})

const getInfo = () => {
    $.get('/warehouses-info').then((data) => {
        if(data != "error"){
            const allowedWhs = []
            const notAllowedWhs = []
            data.forEach(whs => {
                if(whs.Allowed == "0"){
                    notAllowedWhs.push({
                        name:`${whs.WarehouseName} / (${whs.Username})`,
                        code:whs.Username,
                        email:whs.WhsEmail
                    })
                }else{
                    allowedWhs.push({
                        name:`${whs.WarehouseName} / (${whs.Username})`,
                        code:whs.Username,
                        email:whs.WhsEmail
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
            $('#closed').empty()
            $('#opend').empty()
            showModal('noEnternet')
            setTimeout(() => {
                hideModal("noEnternet")
            },1500)
        }
    })
}

const getOptions = (data) => {
    let opts = ''
    data.forEach(opt => {
        opts += `<option id=${opt.code}-${opt.email}>${opt.name}</option>`
    })
    return opts
}

const change = (type) => {
    const openedOption = $('#opendWhs').find(":selected")
    const closedOption = $('#closedWhs').find(":selected")
    let id;
    let email;
    if(type != "open"){
        if(openedOption[0]){
            showModal("spinner")
            if(type == "close"){
                const arr = openedOption[0].id.split('-')
                id = arr[0]
                email = arr[1]
            }else{
                id = "null"
                email = "null"
            }
            $.post(`/change-allow/${type}/${id}/${email}`)
            .then((msg) => {
                if(msg == "done"){
                    setTimeout(() => {
                        hideModal("spinner")
                        refresh()
                    }, 200)
                }else{
                    hideModal("spinner")
                    showModal('noEnternet')
                    setTimeout(() => {
                        hideModal("noEnternet")
                    },1500)}
            })
        }
    }else{
        if(closedOption[0]){
            showModal("spinner")
            const arr = closedOption[0].id.split('-')
            id = arr[0]
            email = arr[1]
            $.post(`/change-allow/${type}/${id}/${email}`)
            .then((msg) => {
                if(msg == "done"){
                    setTimeout(() => {
                        hideModal("spinner")
                        refresh()
                    }, 200)
                }else{
                    hideModal("spinner")
                    showModal('noEnternet')
                    setTimeout(() => {
                        hideModal("noEnternet")
                    },1500)}
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

  const goDirect = (page,data) => {
    $('#body').html(data)
    document.getElementById(`${page}`).click();
  }
  