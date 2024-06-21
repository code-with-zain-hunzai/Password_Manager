import { VscGithubInverted } from "react-icons/vsc";

const Navbar = () => {
    return (
        <nav className='bg-salate-800 text-white pb-10'>
            <div className='mycontainer flex justify-between px-4 items-center h-14'>
            <div className="logo font-bold text-2xl ">
                <span className='text-green-500'>&lt;</span>
                Pass<span className='text-green-500'>OP/&gt;</span>
                </div>
            {/* <ul>
                <li className='flex gap-5'>
                    <a className='hover:font-bold' href="/">Home</a>
                    <a className='hover:font-bold' href="/">About</a>
                    <a className='hover:font-bold' href="/">Contact</a>
                </li>
            </ul> */}
            <button className='github'>
            <VscGithubInverted className="text-3xl" />
            </button>
            </div>
        </nav>
    )
}

export default Navbar
