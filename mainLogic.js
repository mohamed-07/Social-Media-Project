
const BaseUrl = "https://tarmeezacademy.com/api/v1";  

// Function for Check if user is login or logout modify the UI 
function setupUI(){
    const token = localStorage.getItem('token');

    const loginDiv = document.getElementById('loged-in-div')
    const logoutDiv = document.getElementById('logout-div')
    //Add btn 
    const  addBtn = document.getElementById('add-btn')

    if(token == null){ //user is guest (not logged in)
        if(addBtn != null){
            addBtn.style.setProperty('display', 'none', 'important')
        }
        loginDiv.style.setProperty('display', 'flex', 'important');
        logoutDiv.style.setProperty('display', 'none', 'important');

        
    }else{
        if(addBtn != null){
            addBtn.style.setProperty('display', 'block', 'important')
        }
        loginDiv.style.setProperty('display', 'none', 'important');
        logoutDiv.style.setProperty('display', 'flex', 'important');
        // Add UserName To Navbar
        const user = getCurrentUser()
        document.getElementById('nav-username').innerHTML = user.username;
        // Add Profile image To Navbar
        document.getElementById('nav-image').src = user.profile_image;
    }
}

// Get Uesr Data From Localstorage
function getCurrentUser(){
    let user = null;
    const storageUser = localStorage.getItem('user')
    if(storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user;
}

// Function For Login User
function loginBtnClicked(){
        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;

        const params = {
            "username":username,
            "password":password
        }
        const url = `${BaseUrl}/login`
        // Show toggele
        toggleLoader(true)
        axios.post(url, params)
        .then((response)=> {
            // save token in localstorage user 
            localStorage.setItem('token', response.data.token);
            // save user data in localstorige as string
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // hide the modal in last setup bootstrap method
            const modal = document.getElementById('modal')
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal)
            modalInstance.hide();
            // alert('user logged in Succeessfully')
            setupUI()
            // Show the Seccess Alert
            ShowAlert("Logged in Successfully",'success')
        }).catch((error) =>{
            const message = error.response.data.message;
            ShowAlert(message,'danger')
        }).finally(()=>{
            // Hide toggele
            toggleLoader(false)
        })
}

// Function For Logout User
function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    ShowAlert('Logged Out Successfully')
    setupUI()
}

// This Function For Show Seccess Alert 
function ShowAlert(customeMessage, type = 'success'){
    const alertPlaceholder = document.getElementById('successAlert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
            ].join('')

        alertPlaceholder.append(wrapper)
    }
        appendAlert(customeMessage, type)

        // Todo: Hide the alart
        setTimeout(() => {
                const alartHide = bootstrap.Alert.getOrCreateInstance('#successAlert')
                // alartHide.hide()
            }, 2500);
}  

// Function For Register New Usre 
function registerBtnClicked(){
    const name = document.getElementById('register-name-input').value;
    const username = document.getElementById('register-username-input').value;
    const password = document.getElementById('register-password-input').value;
    const image = document.getElementById('register-image-input').files[0];

    let formData = new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    
        const headers = {
            "Content-Type":"multipart/form-data"
        }
        const url = `${BaseUrl}/register`
            // Show toggele
        toggleLoader(true)
        axios.post(url, formData,{
            headers:headers
        })
        .then((response)=> {
            // save token in localstorage user 
            localStorage.setItem('token', response.data.token);
            // save user data in localstorige as string
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // hide the modal in last setup bootstrap method
            const modal = document.getElementById('register-modal')
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal)
            modalInstance.hide();
            // Show the Seccess Alert
            ShowAlert("New User Registered Successfully" ,'success')
            // alert('user logged in Succeessfully')
            setupUI()
        }).catch((error)=>{
            const message = error.response.data.message;
            console.log(error,'The Username Has Been Alredy Token')
            ShowAlert(message,'danger')
        }).finally(()=>{
        // Hide toggele
        toggleLoader(false)
        })
}

// Function for get id clicked
function postClicked(postId){
    // This code for set clicked post id to window location 
    window.location = `pageDetails.html?postId=${postId}`
}

// Function For Edit Post
function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("post-id-input").value = post.id
    document.getElementById('post-title-input').value = post.title
    document.getElementById('post-body-input').value = post.body
    
    document.getElementById('btn-edit').innerHTML = "Update"
    document.getElementById('post-modal-title').innerHTML = "Edit Post"
    let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'), {})
    postModal.toggle()
}

// This Function For Create A New Post 
function createNewPostClicked(){
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""

    const title = document.getElementById('post-title-input').value;
    const body = document.getElementById('post-body-input').value;
    const image = document.getElementById('post-image-input').files[0];
    // Get The Token From LocalStorage
    const token = localStorage.getItem("token");

    // In This Post Request We Will Use FormData in Request
        let formData = new FormData()
        formData.append("title",title)
        formData.append("body",body)
        formData.append("image",image)

        let url = ``;
        // Declaire An Object For Use It as Param in Header
        const headers = {
            "authorization":`Bearer ${token}`
        }

        if(isCreate == true) {
            url = `${BaseUrl}/posts`;
        } else {
            formData.append("_method", "put")
            url = `${BaseUrl}/posts/${postId}`
        }
        // Show toggele
        toggleLoader(true)
        axios.post(url, formData,{   //$ You have Add The Headers as Object not as param like =>(axios.post(url, params,headers{... })
            headers: headers
        })
        .then((response)=> {
            console.log(response)
            // Hide Post model 
            const modal = document.getElementById('create-post-modal')
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal)
            modalInstance.hide();
            ShowAlert("New Post Has Been Created" ,'success')
            // call (getPosts) function for refreche the page
            getPosts()
        }).catch((error)=>{
            const message = error.response.data.message;
            ShowAlert(message,'danger')
        }).finally(()=>{
            // Hide toggele
            toggleLoader(false)
        })
}

// Function For edit mudal for delete Post
function deletePostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)

    document.getElementById('delete-post-id-input').value = post.id
    let postModal = new bootstrap.Modal(document.getElementById('delete-post-modal'), {})
    postModal.toggle()
}

// Function For Delete Post
function confirmDelete(){
    const token = localStorage.getItem('token')
    const postId = document.getElementById('delete-post-id-input').value
    const url = `${BaseUrl}/posts/${postId}`
    const headers = {
            "authorization":`Bearer ${token}`
        }

    axios.delete(url,{
        headers: headers
    })
    .then((response)=> {
        const modal = document.getElementById('delete-post-modal')
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal)
            modalInstance.hide();
            ShowAlert("The Post Has Been Deleted Successfully" ,'success')
            // call (getPosts) function for refreche the page
            getPosts()

    }).catch((error)=>{
        const massege = error.response.data.message
        ShowAlert(massege, 'danger')
    })
}

// Function for get user profilr clicked
function profileClicked(){
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}

// For Show And Hide Loader
function toggleLoader(show = true){
    if(show){
        document.getElementById('loader').style.visibility = 'visible';
    }else{
        document.getElementById('loader').style.visibility = 'hidden';
    }
}