
document.addEventListener('DOMContentLoaded', function() {
    const user = document.getElementById('users')
    try {
        fetch('/getuser')
        .then(response => response.json())
        .then(data => {
        data.forEach(element => {
            const newdiv = document.createElement('div')
            newdiv.innerHTML =`<div class="my-2 border rounded-lg d-flex justify-content-center align-items-center px-5" style="height: 150px; background-color: lightblue;opacity: 0.4;">
            <div class="form-control">${element}</div>
        </div>`
        user.appendChild(newdiv)
        });
        })
    } catch (error) {
      console.log(error)  
    }   
})