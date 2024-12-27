import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {heroVideo, smallHeroVideo} from '../utils';
import { useEffect, useState } from "react";



const Hero = () => {

    const[videoSrc, setVideoSrc] = useState(window.innerWidth<760? smallHeroVideo : heroVideo)
    // useState(window.innerWidth<760? smallHeroVideo : heroVideo):-  here if the inner width of the window screen is less than 760px then videoSrc will be smallHeroVideo else it will be heroVideo

    useGSAP(()=>{
        gsap.to('#hero' , {
            opacity:1,
            delay: 2,
        })
        gsap.to('#cta',{
            opacity:1,
            delay: 2,
            y: -50,
        })
    },[])

    const resizeHandler = ()=>{
        if(window.innerWidth<760){
            setVideoSrc(smallHeroVideo);
        }
        else{
            setVideoSrc(heroVideo)
        }
    }

    useEffect(()=>{
        window.addEventListener('resize',resizeHandler);
        return () =>{
            removeEventListener('resize', resizeHandler);// this will remove the event listner once its job is done
        }
    },[])

  return (
    <section className='w-full nav-height bg-black relative'>
        <div className='h-5/6 w-full flex-center flex-col'>
            <p id='hero' className='hero-title'>iPhone 15 Pro</p>
            <div className="md:w-10/12 w-9/12">
                <video className="pointers-events-none" autoPlay muted playsInLine={true} key={videoSrc}> {/*playsInLine={true}:-  Without this, iOS browsers may automatically play the video in full-screen mode when it starts, which can disrupt your layout. By setting playsInLine, the video stays inline within the webpage's content area. */}
                    {/*className="pointers-events-none":- this prevents the user the temper with the video or click it */}
                    <source src={videoSrc} type='video/mp4' />
                </video>
            </div>
        </div>

        <div id='cta' className="flex items-center flex-col opacity-0 translate-y-20">{/*The class translate-y-20 will move the element down by 80px (5rem). basically it defines along which axis will the transition occur */}
            <a href="#highlights" className="btn">Buy</a>
            <p className="font-normal text-xl">From $199/month or $999</p>
        </div>
    </section>
  )
}

export default Hero