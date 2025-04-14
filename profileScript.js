
setupUI()
// Function For Show Profile
getUser()

// Get Current User Id 
function getCurrentUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}

// Function for get spicific User (id)
function getUser(){

    const id = getCurrentUserId()
    axios.get(`${BaseUrl}/users/${id}`)
    .then((response)=> {
        const user = response.data.data
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-image").src = user.profile_image
        document.getElementById("name-post").innerHTML = user.name

        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count
    })
}

// function for get user
getPosts()

function getPosts() {
    const id = getCurrentUserId()
    // Make a request for a user with a given ID
    toggleLoader(true)
    axios.get(`${BaseUrl}/users/${id}/posts`)
    .then(function (response) {
        toggleLoader(false)
        const posts = response.data.data
        document.getElementById('user-posts').innerHTML = ""
        
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
        let postImage = './image/sensitive.jpg'
                // This code For hide Adilt image Content
                if (post.author.id == "1246" || post.author.id == "1164") {
                    post.image = postImage
                }
                // **************

        let content = `
                <div class="card shadow my-4">
                    <div class="card-header">
                        <img src="${post.author.profile_image}" alt="" class="rounded-circle border border-1" style="width: 40px; height: 40px;">
                        <b>${post.author.username}</b>

                        ${editBtnContent}
                    </div>
                    <div class="card-body"  onclick="postClicked(${post.id})" style="cursor:pointer">
                        <img class="w-100 " src="${post.image}" alt="" style="height: 480px;">
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
    document.getElementById('user-posts').innerHTML += content;
    // Add Tags to the post 
    const currentPostTagsId = `post-tags-${post.id}`
    document.getElementById(currentPostTagsId).innerHTML = ""

    for(tag of post.tags){
        let tagsContent = `
            <button class="btn btn-sm rounded-5" style="background_color:gray;color:white">
            ${tag.name}
            </button> `

        document.getElementById(currentPostTagsId).innerHTML += tagsContent
    }
    }
    })
}