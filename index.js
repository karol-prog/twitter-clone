import { tweetsData } from "/data.js"; //import data.js
import { v4 as uuidv4 } from "https://jspm.dev/uuid"; //import UUID from github repo

const tweetInput = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");
const feed = document.getElementById("feed");

//watch for clicks in the all document when clicked is like, share,comment
document.addEventListener("click", function (e) {
  if (e.target.dataset.heart) {
    handleLikeClick(e.target.dataset.heart);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if ((e.target.id = tweetBtn)) {
    handleTweetBtn(tweetBtn);
  }
});

//function for loop throught each object
function getFeedToHtml(feed) {
  let feedHtml = "";
  let redHeart = "";
  let greenRetweed = "";
  let replies = "";

  feed.forEach(function (feeds) {
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
    //if in data.js replies lenght is more than 0 loop throught this replies and take this borderplate
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

    //add this border plate to variable
    feedHtml += `<div class="tweet">
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
        </div> 
        <div class="hidden" id="replies-${feeds.uuid}">
            ${replies}
        </div> 
    </div>`;
  });
  return feedHtml; //return value that stores borderplate
}

//function for render the border plate to the screen
function renderTweets(feeds) {
  let feedsToRender = getFeedToHtml(feeds);
  feed.innerHTML = feedsToRender;
}

//call the render function
renderTweets(tweetsData);

//function for like icon
function handleLikeClick(tweetId) {
  //target the rigt tweet object
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0]; //take the 0 indes of array

  //if isLiked in data.js is true decrement the likes else increment
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--; //in object go to property likes and decrement it
  } else {
    targetTweetObj.likes++; //in object go to property likes and increment it
  }

  //change targetTweetObj to true or false
  targetTweetObj.isLiked = !targetTweetObj.isLiked;

  //render out the likes
  renderTweets(tweetsData);
}

//function for retweet icon
function handleRetweetClick(retweets) {
  //target the rigt tweet object
  const targetRetweetObj = tweetsData.filter(function (retweet) {
    return retweet.uuid === retweets;
  })[0]; //take the 0 indes of array

  //if isRetweeted in data.js is true decrement the likes else increment
  if (targetRetweetObj.isRetweeted) {
    targetRetweetObj.retweets--;
  } else {
    targetRetweetObj.retweets++;
  }

  //change targetTweetObj to true or false
  targetRetweetObj.isRetweeted = !targetRetweetObj.isRetweeted;

  //render out the retweets
  renderTweets(tweetsData);
}

//function for replies
function handleReplyClick(reply) {
  document.getElementById(`replies-${reply}`).classList.toggle("hidden");
}

//function for Tweet Btn
function handleTweetBtn() {
  //if inputvalue have something in it
  if (tweetInput.value) {
    //push this hardcoded object up to feed tweets
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: `${tweetInput.value}`, //the text which will be render out
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(), //call the uuid generator
    });
    renderTweets(tweetsData); //call the render function
    tweetInput.value = ""; //clear input
  }
}
