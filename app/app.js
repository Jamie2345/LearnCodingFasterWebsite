function shuffleList(array) {
  for (var i = array.length - 1; i > 0; i--) {
      
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));
    
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  
  return array;
}

function addLeadingZero(string) {
  if (string.length < 2) {
    return '0' + string;
  }
  return string
}

function convertISODurationToHMS(input) {
  var iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

  var matches = input.match(iso8601DurationRegex);

  let hours = matches[6] === undefined ? "00" : matches[6]
  let minutes = matches[7] === undefined ? "00" : matches[7]
  let seconds = matches[8] === undefined ? "00" : matches[8]
  
  if (hours != "00") {
    return hours + ':' + addLeadingZero(minutes) + ':' + addLeadingZero(seconds)
  }
  else if (minutes != "00") {
    return minutes + ':' + addLeadingZero(seconds)
  }
  else {
    return "0" + ":" + addLeadingZero(seconds)
  }

}

function roundData(number, end_info) {
  // less than 1,000 / 1K
  if (number < 1000) {
  return `${number.toString()} ${end_info}`;
  }

  // less than 10,000 / 10K
  else if (number < 10000) {
    var result = 100 * Math.floor(number / 100) / 1000;
    return `${result.toString()}K ${end_info}`
  }

  // less than 1,000,000
  else if (number < 1000000) {
    var result = 1000 * Math.floor(number / 1000) / 1000;
    return `${result.toString()}K ${end_info}`
  }

  else if (number < 10000000) {
    var result = 1000 * Math.floor(number / 100000) / 10000;
    return `${result.toString()}M ${end_info}`
  }

  else {
    var result = 1000 * Math.floor(number / 1000000) / 1000;
    return `${result.toString()}M ${end_info}`
  }

}

function timeAgo(date) {
  var current_time = new Date();
  var diff = current_time - date;
  
  const milliseconds_in_a_day = 86400000;
  const milliseconds_in_a_week = 604800000;
  const milliseconds_in_a_month = 2592000000;
  const milliseconds_in_a_year = 31536000000;

  const days = Math.floor(diff / milliseconds_in_a_day);
  const weeks = Math.floor(diff / milliseconds_in_a_week);
  const months = Math.floor(diff / milliseconds_in_a_month);
  const years = Math.floor(diff / milliseconds_in_a_year);

  if (years > 0) {
    if (years == 1) {
      return "1 year ago";
    }
    return years.toString() + " years ago";
  }

  else if (months > 0) {
    if (months == 1) {
      return "1 month ago";
    }
    return months.toString() + " months ago";
  }

  else if (weeks > 0) {
    if (weeks == 1) {
      return "1 week ago";
    }
    return weeks.toString() + " weeks ago";
  }

  else if (days > 0) {
    if (days == 1) {
      return "1 day ago";
    }
    return days.toString() + " days ago";
  }

}

function elementFromHTML(html) {
  const template = document.createElement("template");

  template.innerHTML = html.trim();

  return template.content.firstElementChild;
}


let videoLoader = {
  'APIKEY': 'AIzaSyA2-6fWFpeTMqyPnLVfNSfB1m6wRvMuIa8',
  console.log("test")
  
  getVideoData: async function(video_id) {
    var url = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + video_id + "&key=" + this.APIKEY;
    fetch (url)
    
    .then((response) => {
      if (!response.ok) {
        alert("Failed to load videos");
        throw new Error("Failed to load videos");
      }
      return response.json();
    })
    .then((data) => this.displayVideo(data));
  },

  getAllVideosData: function(lst_videos, amount_to_show) {

    if (amount_to_show > lst_videos.length) {
      amount_to_show = lst_videos.length;
    }
    
    // check if on videos page if so make amount_to_show max
    var myEle = document.getElementById("videos-page");
    if(myEle){
      amount_to_show = lst_videos.length;
    }

    // shuffle lst
    lst_videos = shuffleList(lst_videos);

    for (i = 0; i < amount_to_show; i++) {
      var video = lst_videos[i];
      this.getVideoData(video);
    }
  },
    
  displayVideo: function(video_data) {
    var vid_data = video_data["items"][0];
    var vid_snippet = vid_data["snippet"];
    var channel_id = vid_snippet["channelId"];

    // getting all video data sorted into variables
    var time_published = new Date(vid_snippet["publishedAt"]);
    var time_ago = timeAgo(time_published);

    var vid_id = vid_data["id"];
    var channel_title = vid_snippet["channelTitle"];
    var video_title = vid_snippet["localized"]["title"];

    var duration = convertISODurationToHMS(vid_data["contentDetails"]["duration"]);
    
    var stats = vid_data["statistics"];
    var views = stats["viewCount"];

    var vid = elementFromHTML(`<article class="video-container">
    <a href="https://www.youtube.com/watch?v=${vid_id}" class="thumbnail" data-duration="${duration}" target="_blank" rel="noopener noreferrer">
      <img src="images/videos_and_icons/${vid_id}/thumbnail.png" alt="Thumbnail Image" class="thumbnail-image"/>
    </a>
    <div class="video-bottom-section">
      <a href="https://www.youtube.com/channel/${channel_id}" target="_blank" rel="noopener noreferrer">
        <img src="images/videos_and_icons/${vid_id}/channel_icon.png" alt="Channel Icon" class="channel-icon"/>
      </a>
    </div>
    <div class="video-details">
      <a href="https://www.youtube.com/watch?v=${vid_id}" class="video-title" target="_blank" rel="noopener noreferrer">${video_title}</a>
      <a href="https://www.youtube.com/channel/${channel_id}" class="video-channel-name" target="_blank" rel="noopener noreferrer">${channel_title}</a>
      <div class="video-metadata">
        <span>${roundData(views, 'views')}</span>
        •
        <span>${time_ago}</span>
      </div>
    </div>
  </article>`);

    var video_section = document.querySelector(".video-section");
    video_section.appendChild(vid);
  }

}

let channelLoader = {
  'APIKEY': 'AIzaSyA2-6fWFpeTMqyPnLVfNSfB1m6wRvMuIa8',

  getChannelData(channel) {
    var url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channel}&key=${this.APIKEY}`
    fetch (url)

    .then((response) => {
      if (!response.ok) {
        alert("Failed to load channel data");
        throw new Error("Failed to load channel data");
      }
      return response.json();
    })
    .then((data) => this.displayChannel(data));

  },

  getAllChannelsData: function(channel_ids, amount_to_show=null) {
    if (!amount_to_show || amount_to_show > channel_ids.length) {
      amount_to_show = channel_ids.length;
    }

    if(!amount_to_show){
      amount_to_show = channel_ids.length;
    }

    // shuffle list
    lst_channels = shuffleList(channel_ids);

    for (i = 0; i < amount_to_show; i++) {
      var channel = lst_channels[i];
      this.getChannelData(channel);
    }
  },

  displayChannel: function(channel_json) {
    var channel_id = channel_json["items"][0]["id"];
    var channel_name = channel_json["items"][0]["snippet"]["title"];

    var channel_stats = channel_json["items"][0]["statistics"];
    var subscribers = channel_stats["subscriberCount"];

    var channel = elementFromHTML(`<article class="channel-container">
    <a href="https://www.youtube.com/channel/${channel_id}" class="channel-image" target="_blank" rel="noopener noreferrer">
      <img src="images/channels/${channel_id}/channel_icon.png" alt="Channel Image" class="channel-image"/>
    </a>
    <div class="channel-bottom-section">
      <a href="https://www.youtube.com/channel/${channel_id}" class="channel-title" target="_blank" rel="noopener noreferrer">${channel_name}</a>
      <div class="channel-metadata">
        <span>${roundData(subscribers, 'subscribers')}</span>
      </div>
    </div>
  </article>`);

    var channel_section = document.querySelector(".channel-section");
    channel_section.appendChild(channel);
  }
}

function onHomePage() {
  var homePageBody = document.getElementById("index-page");
  if (homePageBody) {
    return true
  }
  return false || window.location.pathname == '/';
}

const videos = ["I-k-iTUMQAY", "s9iPo9YMU70", "FrFY6Y1MJBQ", "rfscVS0vtbw", "k9WqpQp8VSU", "BkzYfW1H8LI", "glgmavKWg3Y", "2GjQzBWdDAc", "vWNa15pjzi4", "MHPGeQD8TvI", "EPylVlpKpZA", "zJSY8tbf_ys", "Q33KBiDriJY", "XKHEtdqhLK8", "xk4_1vDrzzo", "-TkoO8Z07hI", "wxznTygnRfQ", "87SH2Cn0s9A", "CBYHwZcbD-s", "HD13eq_Pmp8", "wRNinF7YQqQ", "8dWL3wF_OMw", "5OdVJbNCSso"]
const channels = ["UC4JX40jDee_tINbkjycV4Sg", "UC8butISFwT-Wl7EV0hUK0BQ", "UCFbNIlppjAuEX4znoulh0Cw", "UCWv7vMbMWH4-V0ZXdmDpPBA", "UCsLo154Krjwhoz8W00N8ItA", "UCaO6VoaYJv4kS-TQO_M-N_g", "UC4SVo0Ue36XCfOyb5Lh1viQ"]

if (onHomePage()) {
  videoLoader.getAllVideosData(videos, 10)
  channelLoader.getAllChannelsData(channels, 5)

  // add button to close channel section
  document.querySelector(".section-title-close").addEventListener("click", function () {
    // close section
    var channelSection = document.querySelector(".channel-section");
    channelSection.style.display = 'none';
    var anchorTag = document.getElementById("more-channels-anchor");
    anchorTag.style.display = 'none';
  })
}

if (document.URL.includes("videos")) {
  videoLoader.getAllVideosData(videos)
}

if (document.URL.includes("channels")) {
  channelLoader.getAllChannelsData(channels)
}


