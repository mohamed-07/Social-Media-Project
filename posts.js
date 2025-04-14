
let currentPage = 1;
let lastPage = 1;

window.addEventListener('scroll', function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    // console.log(endOfPage)
    if(endOfPage && currentPage < lastPage){
        // Get Next Page When Scrool end 
        currentPage = currentPage + 1
        getPosts(false, currentPage)
        console.log(currentPage)
    }
});


// If User is Logged Remove Button Login & Register 
    setupUI()

// Function For Get All Posts
function getPosts(reload = true, page = 1) {

    // Show Loader when wait response
    toggleLoader(true)
    // Make a request for a user with a given ID
    axios.get(`${BaseUrl}/posts?limit=20&page=${page}`)
    .then(function (response) {
        // hide Loader 
    toggleLoader(false)
    const posts = response.data.data
    lastPage = response.data.meta.last_page;


    if(reload){
        document.getElementById("posts").innerHTML = "";
    }
    for(post of posts){
        let postTitle = "";
        // Show or hide (edit) button
        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``
        
        if(isMyPost){
            editBtnContent = `
            <button class="btn btn-danger" style='margin-left:5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> delete </button>
            <button class="btn btn-secondary" style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> edit </button>
            `
        }
        if(post.title == null){
            post.title = postTitle;
        }

        // ADD this code in getPosts Function
        // This code For hide Adult Image 
        let postImage = './image/sensitive.jpg'
        if(post.author.id == "1246" ||post.author.id == "1164" ||post.author.id == "1360" ){
            // console.log("Adult Content Exist",post.author.id)
            post.image = postImage
            }
        // ************

        let content = `
                <div class="card shadow my-4">
                    <div class="card-header">
                        <span onclick='userClicked(${post.author.id})' style="cursor:pointer">
                            <img src="${post.author.profile_image}" alt="" class="rounded-circle border border-1" style="width: 40px; height: 40px;">
                            <b>${post.author.username}</b>
                        </span>
                        ${editBtnContent}
                    </div>
                    <div class="card-body"  onclick="postClicked(${post.id})" style="cursor:pointer">
                        <img class="w-100" src="${post.image}" alt="" style="height: 480px;">
                        <h6 class="text-secondary mt-1">${post.created_at}</h6>
                        <h4>${post.title}</h4>
                        <p>${post.body}.</p>
                        <hr>
                            <div class="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" /></svg>
                                <span>(${post.comments_count}) Comments
                    
                                <span id="post-tags-${post.id}"></span>
                            </div>
                    </div>
                </div>
                `
    document.getElementById('posts').innerHTML += content;


    // Add Tags to the post 
    const currentPostTagsId = `post-tags-${post.id}`
    document.getElementById(currentPostTagsId).innerHTML = ""

    for(tag of post.tags){
        // console.log(tag.name)
        let tagsContent = `
            <button class="btn btn-sm rounded-5" style="background_color:gray;color:white">
            ${tag.name}
            </button> `

        document.getElementById(currentPostTagsId).innerHTML += tagsContent
    }

    }
    // console.log(posts);
    })
}
getPosts()

// Function For Edit Model for edit Post
function addBtnClicked(){

    document.getElementById("post-id-input").value = ""
    document.getElementById('post-title-input').value = ""
    document.getElementById('post-body-input').value = ""
    
    document.getElementById('btn-edit').innerHTML = "Craete"
    document.getElementById('post-modal-title').innerHTML = "Create A New Post"
    let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'), {})
    postModal.toggle()
}

// funciton for set (Id) user clicked
function userClicked(userId){
    // alert(userId)
    window.location = `profile.html?userid=${userId}`
}



















