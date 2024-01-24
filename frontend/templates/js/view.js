
document.addEventListener('DOMContentLoaded', function(){
    const tbody = document.getElementById('admin-tbody')
    const smtr = document.getElementById('smtr')
    try {
        fetch('/alluserdata')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data?.forEach(element => {
                if(element.userid){
                    const tr = document.createElement('tr')
                    const newtr = document.createElement('div')
                tr.innerHTML = ` <td style="border: 2px solid #000000"><span>${element.userid}</span></td>
                <td style="border: 2px solid #000000">${element.name}</td>
                <td style="border: 2px solid #000000"><img src="${element.image}"></td>
                <td style="border: 2px solid #000000">
                ${
                    element?.image ? ` <a href="/delete/${element._id}" class="btn btn-outline-primary px-4">Delete</a>`: ''
                }
                ${
                    element?.status ? '' : `<a href="/done/${element._id}" class="btn btn-primary px-4">Done</a>`
                }
                
                </td>`

                newtr.innerHTML = `<div class="row mx-3 p-3" style="border: 2px solid #000000; background-color: #EAECFF;">
                <div class="col text-right">
                    <span>User Id:</span>
                    <span>${element?.userid}</span>
                </div>
                <div class="border-left"></div>
                <div class="col">
                    <span>Name:</span>
                    <span>${element?.name}</span>
                </div>
            </div>
            <div class="row mx-3 py-3" style="background-color: whitesmoke">
                <div class="col text-left">
                    <span>Photo:</span>
                    <img src="${element?.image}">
                </div>
                <div class="col text-center">
                    <span>Action</span>
                    <div class="d-flex mt-3">
                        ${
                            element?.image ?  `<a href="/delete/${element._id}" class="btn btn-outline-primary px-4">Delete</a>`:''
                        }
                        ${
                            element?.status ? '':`<a href="/done/${element._id}" class="btn btn-primary px-4 mx-2">Done</a>`
                        }
                        
                        
                    </div>
                </div>
            </div>`

                tbody.appendChild(tr)
                smtr.appendChild(newtr)
                }
            });
        })
    } catch (error) {
        console.log(error)
    }
})