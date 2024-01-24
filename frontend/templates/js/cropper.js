
var cropper;

function Crop(){
    const image = document.getElementById('image')
    cropper = new Cropper(image, {
    aspectRatio: 0,
    viewMode: 0
})
}

document.addEventListener('DOMContentLoaded', function() {

    var croppedImage;

    const image = document.getElementById('image-input')
    const preview = document.getElementById('imagePreview')
    const imagebox = document.getElementById('image-box')
    const uploadButton = document.getElementById('button')
    const viewButton = document.getElementById('viewButton')
    const div = document.getElementById('imgbody')

    image.addEventListener('input', function(){
        console.log(image?.files[0])
        if(image?.files[0]){
            const reader = new FileReader();
            reader.onload = function(e){
                const img = document.createElement('img');
                img.classList.add('imageview')
                img.src = e.target.result;
                img.id = 'image'
                preview.innerHTML = '';
                preview.appendChild(img);
                Crop();
            }
            reader.readAsDataURL(image?.files[0])
            imagebox.style.display = 'none'
        }else{
            preview.innerHTML = 'No image selected';
        }
    })

    uploadButton.addEventListener('click', function(){
        const name = document.getElementById('name').value;
        var imgCropped = cropper.getCroppedCanvas().toDataURL('image/webp');

        fetch('http://localhost:8080/upload',{
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            body:new URLSearchParams({
                name:name,
                img: imgCropped
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            console.log("DONE")
            return response.json();
        })
        .then(data => {
            console.log('Response', data)
        })
        .catch(error => {
            console.error('Error', error)
        })
    })

    // ========== When View Button Is clicked =====================
    
    viewButton.addEventListener('click', function() {
        try {
            fetch('/getimage')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            div.innerHTML = ''
            data.forEach(element => {
                console.log(element?.name)
                const newdiv = document.createElement('div')
                newdiv.innerHTML = `<label>Name</label>
                <input class="form-control" placeholder="${element?.name}" disabled>
                <label class="mt-3">Photo</label>
                <img class="d-block " id="sidebarimg" src="${element?.image}">
                ${
                    element?.status ? '<p class="fs-3 text-success mt-3"> Accepted by Admin</p>' : '<p class="fs-3 text-danger mt-3">Not Accepted by Admin</p>'
                }
                
              </div>`
              div.appendChild(newdiv)

            });
        })
        } catch (error) {
            console.log(error)
        }
        
    })

})