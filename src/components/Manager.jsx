import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const passwordRef = useRef(null);
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    const showPassword = () => {
        setPasswordVisible(!passwordVisible);
        if (passwordRef.current) {
            passwordRef.current.type = passwordVisible ? "text" : "password";
        }
    }

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, []);

    const copyText = (text) => {
        toast('Copied to clipboard');
        navigator.clipboard.writeText(text);
    }

    const PasswordSave = async () => {
        const { site, username, password } = form;
        const isDuplicate = passwordArray.some(item =>
            item.site === site && item.username === username && item.password === password
        );

        if (isDuplicate) {
            toast.error('Error: Password already saved🤦‍♂️');
            return;
        }

        if (site.length > 3 && username.length > 3 && password.length > 3) {
            const newPasswordEntry = { ...form, id: uuidv4() };
            const updatedPasswordArray = [...passwordArray, newPasswordEntry];
            setPasswordArray(updatedPasswordArray);
            await fetch("http://localhost:3000/", {
                method: "POST", headers: { "Content-type": "application/json" },
                body: JSON.stringify(newPasswordEntry)
            })

            setForm({ site: "", username: "", password: "" });
            toast.success('Password saved successfully');
        } else {
            toast.error('Error: Invalid input lengths');
        }
    }

    const PasswordDelete = async (id, showToast = true) => {
        console.log("Deleting password with id", id);
        let confirmDelete = confirm("Do you really want to delete this password?");
        if (confirmDelete) {
            const updatedPasswordArray = passwordArray.filter(item => item.id !== id);
            setPasswordArray(updatedPasswordArray);

            try {
                let res = await fetch(`http://localhost:3000/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    if (showToast) {
                        toast.success('Password deleted');
                    }
                } else {
                    const errorData = await res.json();
                    toast.error(`Error: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Failed to fetch', error);
                toast.error('Failed to connect to the server');
            }
        }
    };

    const PasswordEdit = (id) => {
        const passwordToEdit = passwordArray.find(item => item.id === id);
        if (passwordToEdit) {
            setForm({ site: passwordToEdit.site, username: passwordToEdit.username, password: passwordToEdit.password });
            toast.info('Password ready to be edited');
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className='p-2 md:p-0 md:mycontainer text-white rounded-lg'>
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    Pass<span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-lg text-green-500 text-center'>Your own Password Manager</p>
                <div className='flex flex-col p-4 text-black gap-5'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website url' className='rounded-2xl outline-none border border-green-500 p-4 py-1' type="text" name='site' />
                    <div className='flex flex-col md:flex-row w-full justify-between gap-8 relative'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-2xl w-full outline-none border border-green-500 p-4 py-1' type="text" name='username' />
                        <div className='relative w-full'>
                            <input
                                value={form.password}
                                onChange={handleChange}
                                ref={passwordRef}
                                placeholder='Enter Password'
                                className='rounded-2xl w-full outline-none border border-green-500 p-4 py-1'
                                type="password"
                                name='password'
                            />
                            <span onClick={showPassword} className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer'>
                                {passwordVisible ? <IoIosEye className="text-xl" /> : <IoIosEyeOff className="text-xl" />}
                            </span>
                        </div>
                    </div>
                    <button onClick={PasswordSave} className='flex justify-center items-center mx-auto gap-1 font-medium w-fit bg-green-400 hover:bg-green-300 py-1 px-2 rounded-xl '>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>
                </div>
                <div className="passwords w-full">
                    <h2 className="font-bold text-2xl text-white py-4">Your Passwords</h2>

                    {passwordArray.length === 0 && <div className="text-white">No passwords to show</div>}
                    {passwordArray.length !== 0 &&
                        <table className="table-auto w-full text-white rounded-md overflow-hidden">
                            <thead className="bg-green-800">
                                <tr>
                                    <th className="py-2">Site</th>
                                    <th className="py-2">Username</th>
                                    <th className="py-2">Password</th>
                                    <th className="py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 text-center">
                                            <div className="md:flex justify-center items-center">
                                                <span>{item.site}</span>
                                                <div className="lordiconcopy size-7 cursor-pointer text-white" onClick={() => { copyText(item.site) }}>
                                                    <lord-icon
                                                        style={{ "height": "25px", "width": "25px", "marginLeft": "10px" }}
                                                        colors="primary:#fff"
                                                        src="https://cdn.lordicon.com/depeqmsz.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="md:flex justify-center items-center">
                                                <span>{item.username}</span>
                                                <div className="lordiconcopy size-7 cursor-pointer text-white" onClick={() => { copyText(item.username) }}>
                                                    <lord-icon
                                                        style={{ "height": "25px", "width": "25px", "marginLeft": "10px" }}
                                                        colors="primary:#fff"
                                                        src="https://cdn.lordicon.com/depeqmsz.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="md:flex justify-center items-center">
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className="lordiconcopy size-7 cursor-pointer text-white" onClick={() => { copyText(item.password) }}>
                                                    <lord-icon
                                                        style={{ "height": "25px", "width": "25px", "marginLeft": "10px" }}
                                                        colors="primary:#fff"
                                                        src="https://cdn.lordicon.com/depeqmsz.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="md:flex justify-center items-center">
                                                <span className="cursor-pointer" onClick={() => { PasswordEdit(item.id) }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/wvdxdmpi.json"
                                                        trigger="hover"
                                                        colors="primary:#fff"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                </span>
                                                <span className="cursor-pointer" onClick={() => { PasswordDelete(item.id) }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/skkahier.json"
                                                        trigger="hover"
                                                        colors="primary:#fff"
                                                        style={{ "width": "25px", "height": "25px", "marginLeft": "10px" }}>
                                                    </lord-icon>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    );
}

export default Manager;
