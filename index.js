import { tweetsData } from "/data.js"; //import data.js
import { v4 as uuidv4 } from "https://jspm.dev/uuid"; //import UUID from github repo

const tweetInput = document.getElementById("tweet-input");
const feed = document.getElementById("feed");

//LOCALSTORAGE
let tweetData;
//take the data from localstorage if something is in LS and convert it from string back to object else write the data.js to tweetData
if (localStorage.getItem("tweet")) {
  tweetData = JSON.parse(localStorage.getItem("tweet"));
} else {
  tweetData = tweetsData;
}

//watch for clicks in the all document when clicked is like, share,comment
document.addEventListener("click", function (e) {
  if (e.target.dataset.heart) {
    handleLikeClick(e.target.dataset.heart);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtn();
  } else if (e.target.dataset.comment) {
    handleNewBtnComment(e.target.dataset.comment);
  } else if (e.target.dataset.delete) {
    handleDeleteTweet(e.target.dataset.delete);
  }
});

//function for loop throught each object
function getFeedToHtml(feed) {
  let feedHtml = "";

  feed.forEach(function (feeds) {
    let redHeart = "";
    let greenRetweed = "";
    let replies = "";

    //add colors to icons when they are clicked
    //for like
    if (feeds.isLiked) {
      redHeart = "liked";
    } else {
      redHeart = "";
    }

    //for retweet
    if (feeds.isRetweeted) {
      greenRetweed = "retweeted";
    } else {
      greenRetweed = "";
    }

    //for replies/comments
    //if in data.js replies lenght is more than 0 loop throught this replies and take this boilerplate
    if (feeds.replies.length > 0) {
      feeds.replies.forEach(function (reply) {
        replies += `
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${reply.handle}</p>
                    <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
        </div>
        `;
      });
    }

    //text area for new comment
    replies += `
    <div class="tweet-reply">
        <textarea id='reply-input-${feeds.uuid}' placeholder="Write your comment..."></textarea>
        <button class='reply-button' data-comment="${feeds.uuid}">Reply</button>
    </div>
`;

    //add this border plate to variable
    feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${feeds.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${feeds.handle}</p>
                <p class="tweet-text">${feeds.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots" data-reply="${feeds.uuid}"></i>
                        ${feeds.replies.length} 
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${redHeart}" data-heart="${feeds.uuid}"></i>
                        ${feeds.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${greenRetweed}" data-retweet="${feeds.uuid}"></i>
                        ${feeds.retweets}
                    </span>
                </div>   
            </div> 
            <div class="delete-container">
              <i class="fa-solid fa-x delete-icon" data-delete="${feeds.uuid}"></i>
            </div>            
        </div> 
        <div class="hidden" id="replies-${feeds.uuid}">
            ${replies}
        </div> 
    </div>`;
  });
  return feedHtml; //return value that stores boilerplate
}

//function for render the border plate to the screen
function renderTweets(feeds) {
  let feedsToRender = getFeedToHtml(feeds);
  feed.innerHTML = feedsToRender;
}

//call the render function
renderTweets(tweetData);

//function for like icon
function handleLikeClick(tweetId) {
  //target the rigt tweet object
  const targetTweetObj = tweetData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0]; //take the 0 index of array because we want to have only object from it

  //if isLiked in data.js is true decrement the likes else increment
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--; //in object go to property likes and decrement it
  } else {
    targetTweetObj.likes++; //in object go to property likes and increment it
  }

  //change targetTweetObj to true or false
  targetTweetObj.isLiked = !targetTweetObj.isLiked;

  updateLocalStorage(); // call the update function for update the localstorage after deleting something

  //update the redner function
  renderTweets(tweetData);
}

//function for retweet icon
function handleRetweetClick(retweets) {
  //target the rigt tweet object
  const targetRetweetObj = tweetData.filter(function (retweet) {
    return retweet.uuid === retweets;
  })[0]; //take the 0 index of array because we want to have only object from it

  //if isRetweeted in data.js is true decrement the likes else increment
  if (targetRetweetObj.isRetweeted) {
    targetRetweetObj.retweets--;
  } else {
    targetRetweetObj.retweets++;
  }

  //change targetTweetObj to true or false
  targetRetweetObj.isRetweeted = !targetRetweetObj.isRetweeted;

  updateLocalStorage(); // call the update function for update the localstorage after deleting something

  //update the redner function
  renderTweets(tweetData);
}

//function for replies
function handleReplyClick(reply) {
  //target the id of reply and add class to toggle hide when is clicked
  document.getElementById(`replies-${reply}`).classList.toggle("hidden");
}

//function for Tweet Btn and input pushing to the tweetsdata in data.js with random uuid
function handleTweetBtn() {
  //if inputvalue have something in it
  if (tweetInput.value) {
    //push this hardcoded object up to feed tweets
    tweetData.unshift({
      handle: `@Karol`,
      profilePic: `images/me.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: `${tweetInput.value}`, //the text which will be render out
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(), //call the uuid generator
    });

    renderTweets(tweetData); //call the render function
    tweetInput.value = ""; //clear input

    updateLocalStorage(); // call the update function for update the localstorage after deleting something
  }
}

//for new comment
function handleNewBtnComment(comment) {
  //take what is in the input value in new comment
  const newCommentInput = document.getElementById(
    `reply-input-${comment}`
  ).value;

  //filter throught data and if uuid match the uuid of current tweet store it to the variable
  const targetNewCommentObj = tweetData.filter(function (newComment) {
    return newComment.uuid === comment;
  })[0]; //return from array the first index of object

  //push to the top new object if input is true
  if (newCommentInput) {
    targetNewCommentObj.replies.unshift({
      handle: `@Karol`,
      profilePic: `images/me.jpg`,
      tweetText: newCommentInput,
    });
  }
  updateLocalStorage(); // call the update function for update the localstorage after deleting something

  renderTweets(tweetData); //update the render
  handleReplyClick(comment); //call the function for not closing the comments after adding new comment
}

//function for delete the tweets
function handleDeleteTweet(tweet) {
  // Find the tweet with the provided UUID
  const targetDeleteObj = tweetData.filter(function (tweets) {
    return tweets.uuid === tweet;
  })[0]; //return from array the first index of object

  //delete the current tweet from array with splice method which takes the current array and remove it only 1
  tweetData.splice(targetDeleteObj, 1);
  updateLocalStorage(); // call the update function for update the localstorage after deleting something
  // Render the updated tweets feed
  renderTweets(tweetData);
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem("tweet", JSON.stringify(tweetData));
}
