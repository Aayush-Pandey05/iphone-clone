import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);//Because the value inside useRef is mutable and doesn't cause re-renders, it's commonly used to reference DOM elements that can be dynamically added or removed.
    const videoDivRef = useRef([]);
    

  // Video and indicator
  const [video, setVideo] = useState({
    // we will monitor the changes in the following properties:-
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;
 // We extracte/destructured these values so that we can easily access them and prevent the use of video.


    useGSAP(() => {
        // slider animation to move the video out of the screen and bring the next video in
        gsap.to("#slider", {
        transform: `translateX(${-100 * videoId}%)`,
        duration: 2,
        ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
        });

        // video animation to play the video when it is in the view
        gsap.to("#video", {
        scrollTrigger: {
            trigger: "#video",
            toggleActions: "restart none none none",
        },
        onComplete: () => {
            setVideo((pre) => ({
            ...pre,
            startPlay: true,
            isPlaying: true,
            }));
        },
        });
    }, [isEnd, videoId]);


  useEffect(() => {
    let currentProgress = 0; // this will determine where are we in the video playing journey
    let span = videoSpanRef.current; //let span = videoSpanRef.current; assigns that current array to the variable span.

    if (span[videoId]) {
      // if there is some video present in the array of sapn then this conditional statement will be triggered
      //animate the progress of the video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                  ? "10vw" // tablet
                  : "4vw", // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        // when the video is ended, replace the progress bar with the indicator
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
            
          }
        },
      });
        if (videoId == 0) {
            anim.restart();
        }

        // update the progress bar
        const animUpdate = () => {
            anim.progress(
            videoRef.current[videoId].currentTime /
                hightlightsSlides[videoId].videoDuration
            );
        };

        if (isPlaying) {
            // ticker to update the progress bar
            gsap.ticker.add(animUpdate);
        } else {
            // remove the ticker when the video is paused (progress bar is stopped)
            gsap.ticker.remove(animUpdate);
        }

    }
  }, [videoId, startPlay]); // use effect will be triggered every time the value of videoId, startPlay changes



  useEffect(() => {
    // this useeffect will specifically track the playing of the video
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play(); // videoRef.current[videoId].play() this will find the specific video we want to trigger once startPlay is true
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

    

  // vd id is the id for every video until id becomes number 3
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)} // here we are finding the id of the current video from the videoRef array and storing it in the el variable which stands for 'element'
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  // we are doing this because textLists is an array in hightlightsSlides so we are mapping though it and storing each element in the variable text
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10 ">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {/*The backdrop-filter: blur() CSS property applies a blur effect to
                 the area behind an element, giving it a frosted-glass or translucent
                  look. */}
          {videoRef.current.map(
            (
              _,
              i // here _ means we are not doing anything from the elements that we are getting from the array and we are just storing it in the _ and its id in the variable i
            ) => (
                <span
                key={i}
                className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                ref={(el) => (videoDivRef.current[i] = el)}
              >
                <span
                  className="absolute h-full w-full rounded-full"
                  ref={(el) => (videoSpanRef.current[i] = el)}
                />
              </span>
            ))}
          </div>
  
          <button className="control-btn">
            <img
              src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
              alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
              onClick={
                isLastVideo
                  ? () => handleProcess("video-reset")
                  : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
              }
            />
          </button>
      </div>
    </>
  );
};

export default VideoCarousel;
