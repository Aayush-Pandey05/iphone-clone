import { appleImg, bagImg, searchImg } from '../utils';  // Ensure these are correctly defined
import { navLists } from '../constants';

const Navbar = () => {
  return (
    <header className='w-full py-5 sm:px-10 px-5 flex justify-between items-center'>
        <nav className='flex w-full screen-max-width'>
            <img src={appleImg} alt='Apple' width={14} height={18} />

            <div className='flex flex-1 justify-center max-sm:hidden'>
                {navLists.map((nav,i)=>(
                    <div className='px-5 text-sm cursor-pointer text-gray hover:text-white' key={nav}>
                        {nav}
                    </div>
                ))}
            </div>

            <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'>
                {/*flex-1 gives the property of shrinking and expanding on the basis of screen size that means the items in the flexbox will expand and shrink freely
                items-baseline:- (basically:- align-items: baseline) this mean the items will be alligned on their baselines which will allign them properly even if their sizes are different */}
                <img src={searchImg} alt="search" width={18} height={18}/>
                <img src={bagImg} alt="bag" width={18} height={18}/>
            </div>
        </nav>
    </header>
  )
}

export default Navbar