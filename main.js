async function getPostsSearch(searchValue) {
  let getPosts = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "GET",
  });
  let posts = await getPosts.json();
  let postsSearch = await posts.filter(
    (item) =>
      item.title.toLowerCase().includes(searchValue) |
      item.body.toLowerCase().includes(searchValue)
  );
  const mainContent = document.querySelector(".main-content");
  const mainContentPosts = document.querySelector(".main-content__posts");
  const ulPagination = document.querySelector(
    ".main-content__posts__pagination"
  );

  mainContentPosts.innerHTML = "";
  ulPagination.innerHTML = "";
  postsMainBodyFunction(
    postsSearch,
    mainContentPosts,
    ulPagination,
    mainContent
  );
}

async function getPosts() {
  let getPosts = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "GET",
  });
  let posts = await getPosts.json();
  const mainContent = document.querySelector(".main-content");
  const mainContentPosts = document.querySelector(".main-content__posts");
  const ulPagination = document.querySelector(
    ".main-content__posts__pagination"
  );
  
  postsMainBodyFunction(posts, mainContentPosts, ulPagination, mainContent);
}

function postsMainBodyFunction(
  posts,
  mainContentPosts,
  ulPagination,
  mainContent
) {
  mainContentPosts.innerHTML = "";
  ulPagination.innerHTML = "";
  const valuePostsPreOnePage = 10;
  let valueLi = Math.ceil(posts.length / valuePostsPreOnePage);

  let blockNumbersPage = [];
  for (let i = 1; i <= valueLi; i++) {
    let li = document.createElement("li");
    li.innerHTML = i;
    ulPagination.appendChild(li);
    blockNumbersPage.push(li);
  }

  showPage(blockNumbersPage[0]);

  for (let blockNumberPage of blockNumbersPage) {
    blockNumberPage.addEventListener("click", function () {
      showPage(this);
    });
  }

  function showPage(activeLi) {
    let active = document.querySelector(
      ".main-content__posts__pagination li.open"
    );
    if (active) {
      active.classList.remove("open");
    }
    activeLi.classList.add("open");

    let pageNumber = +activeLi.innerHTML;

    let start = (pageNumber - 1) * valuePostsPreOnePage;
    let end = start + valuePostsPreOnePage;

    let postsPreOnePage = posts.slice(start, end);
    console.log(postsPreOnePage);
    mainContentPosts.innerHTML = "";
    postsPreOnePage.map((post, index) => {
      mainContentPosts.innerHTML += `
        <div class="main-content__posts__post">
            <div class="main-content__posts__post--id">
                <p>${post.id}</p>
            </div>
            <div class="main-content__posts__post--title">
                <h3>${post.title}</h3>
            </div>
            <div class="main-content__posts__post--remove-btn">
                <img src="img/btn-remove.svg" alt="remove">
            </div>
        </div>                    
        `;
    });
    let post = document.querySelectorAll(".main-content__posts__post");
    post.forEach((post) => {
      post.addEventListener("click", (e) => {
        mainContent.innerHTML = "";
        let id = +e.path[0].children[0].innerText;
        console.log(id);
        getPost(id, mainContent);
      });
    });
  }
}



// open post
async function getPost(id, mainContent) {
  let getPostInOpenPage = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      method: "GET",
    }
  );
  let postInOpenPage = await getPostInOpenPage.json();
  let bodyPost = await postInOpenPage.body.split("\n");

  console.log(bodyPost);
  mainContent.innerHTML += `
  <div class="main-content__posts__post--open">
  <div class="main-content__posts__post--title">
      <h2>${postInOpenPage.title}</h2>
  </div>
  <div class="main-content__posts__post--body">
      <ul>
          
      </ul>
  </div>
</div>`;

const ul = document.querySelector('.main-content__posts__post--body ul')
bodyPost.map((coment)=>{
  
  ul.innerHTML += 
  `<ul>
${coment}          
  </ul>`
  
})
}

// search
const input = document.querySelector("input");
input.oninput = function () {
  let searchValue = this.value;

  if (searchValue != "") {
    getPostsSearch(searchValue);
  } else {
    getPosts();
  }
};

//start
getPosts();
