import React, {useEffect, useRef }from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide} from "swiper/react"
import { FreeMode } from "swiper"
import { Link } from 'react-router-dom'


import PlayPause from './PlayPause'
import { playPause, setActiveSong } from '../redux/features/playerSlice'
import { useGetTopChartsQuery } from '../redux/service/shazamCom'

import "swiper/css"
import "swiper/css/free-mode"
import { SongDetails } from '../pages'

const TopChartCard = ({song, i, isPlaying,activeSong, handlePauseClick, handlePlayClick}) => (
  <div className="w-full flex flex-row items-center hover:bg-[#4c426e] py-2 p-4 rounded-lg
   cursor-pointer mb-2"> 
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
       <img src={song?.images?.coverart} className='w-16 h-16 rounded-full' alt={song?.title}/>
       <div className="flex-1 flex flex-col justify-start mx-2 ">
        <Link to={`/songs/${song.key}`}>
           <p className='text-xl font-bold text-white'>{song?.title}</p>
        </Link>
        <Link to={`/songs/${song?.artists[0].adamid}`}>
           <p className='text-base font-bold text-gray-300 mt-1'>{song?.subtitle}</p>
        </Link>
       </div>
    </div>
    <PlayPause
         song={song}
         isPlaying={isPlaying}
         activeSong={activeSong}
         handlePlay={() => handlePlayClick(song, i)}
         handlePause={handlePauseClick}
    />
   </div>
)
const TopPlay = () => {
  const dispatch = useDispatch()
   const { activeSong, isPlaying} = useSelector((state) => state.player)
   const {data} = useGetTopChartsQuery()
   const divRef = useRef(null)
 useEffect(() => {
  divRef.current.scrollIntoView({ behavior: "smooth"})
 })
  const topPlays = data?.slice(0, 5)
   const handlePauseClick = () => {
    dispatch(playPause(false))
    }
  
    const handlePlayClick = (song, i) => {
        dispatch(setActiveSong({ song, data, i}))
        dispatch(playPause(true))
    }
  return (
    <div className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col" ref={divRef}>
       <div className="w-full flex flex-col">
         <div className="flex flex-row justify-between items-center">
            <h2 className="text-white font-bold text-2xl">Top Charts</h2>
            <Link to="/top-charts"><p className='text-gray-300 text-base cursor-pointer'>See more</p></Link>
         </div>
         <div className="mt-4 flex flex-col gap-1">
          {topPlays?.map((song, i) => (
            <TopChartCard 
             song={song}
             key={song.key}
             i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePlayClick={() => handlePlayClick(song, i)}
              handlePauseClick={handlePauseClick}
            />
          ))}
         </div>
        </div> 

        <div className="w-full flex flex-col mt-8">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-white font-bold text-2xl">Top Artists</h2>
                <Link to="/top-artists"><p className='text-gray-300 text-base cursor-pointer'>See more</p></Link>
            </div>
            <Swiper
             slidesPerView='auto'
             spaceBetween={15}
             freeMode
             centeredSlides
             centeredSlidesBounds
             modules={[FreeMode]}
             className='mt-4'
            >
             {topPlays?.map((song, i) => (
                <SwiperSlide
                 key={song?.key}
                 style={{width: "20%", height: "auto"}}
                 className='shadow-lg rounded-full animate-slideright'
                >
                <Link to={`/artists/${song?.artists[0].adamid}`} >
                    <img src={song?.images?.background} alt="name" className='rounded-full w-full object-cover' />
                </Link>
                </SwiperSlide>
             ))}
            </Swiper>
        </div>  
        {/* <div className="mt-2"> <SongDetails /></div> */}
    </div>
  )
}

export default TopPlay
