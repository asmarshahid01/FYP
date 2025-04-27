import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useGlobalLoader } from "../context/LoaderContext";
import {
  LucidePencil
} from "lucide-react";
import AdminLeftBar from './AdminLeftBar'
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminAddAccounts() {
    const [studentsData, setStudentsData] = useState([]);

    const [supervisorsData, setSupervisorsData] = useState([]);
    const [update,setUpdate]=useState(false);

    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedSupervisors, setSelectedSupervisors] = useState([]);
    const [addStudent, setAddStudent] = useState(false);
    const [addSupervisor, setAddSupervisor] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [isSupervisor, setIsSupervisor] = useState(false);
    const [editSlots, setEditSlots] = useState(0);
    const [addName, setAddName] = useState();
    const [addEmail, setAddEmail] = useState();
    const [addPassword, setAddPassword] = useState();
    const [addSlots, setAddSlots] = useState(0);
    const {hideLoader,showLoader}=useGlobalLoader();



    useEffect(()=>{
        const fetchStudents=async()=>{
            try {
                const response=await axios.get("http://localhost:4000/api/admin/fetchStudents");
                if(response.status===200){
                    setStudentsData(response.data.data);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something Went Wrong");
            }
        }
        const fetchSupervisors=async()=>{
            try {
                const response=await axios.get("http://localhost:4000/api/admin/fetchSupervisors");
                if(response.status===200){
                    setSupervisorsData(response.data.data);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something Went Wrong");
            }
        }
        showLoader();
        fetchStudents();
        fetchSupervisors();
        console.log("Updated");
        hideLoader();
    },[update])


    // const handleStudentsCSVUpload = (file) => {
    //     if (!file) return;
      
    //     Papa.parse(file, {
    //       header: true,
    //       skipEmptyLines: true,
    //       complete: (results) => {
    //         const parsedStudents = results.data.map((row, index) => ({
    //           id: studentsData.length + index + 1,
    //           name: row.Name || "",
    //           email: row.Email || "",
    //           password: row.Password || "",
    //         }));

    //         setStudentsData((prev) => {
    //             const existingEmails = new Set(prev.map((s) => s.email));
    //             const filteredNew = parsedStudents.filter(
    //               (student) => !existingEmails.has(student.email)
    //             );
    //             return [...prev, ...filteredNew];
    //           });
    //       },
    //       error: (err) => {
    //         console.error("CSV parse error:", err);
    //       },
    //     });
    //   };

    //   const handleSupervisorsCSVUpload = (file) => {
    //     if (!file) return;
      
    //     Papa.parse(file, {
    //       header: true,
    //       skipEmptyLines: true,
    //       complete: (results) => {
    //         const parsedSupervisors = results.data.map((row, index) => ({
    //           id: supervisorsData.length + index + 1,
    //           name: row.Name || "",
    //           email: row.Email || "",
    //           password: row.Password || "",
    //           slots: parseInt(row.Slots) || 0
    //         }));
      
    //         setSupervisorsData((prev) => {
    //             const existingEmails = new Set(prev.map((s) => s.email));
    //             const filteredNew = parsedSupervisors.filter(
    //               (supervisor) => !existingEmails.has(supervisor.email)
    //             );
    //             return [...prev, ...filteredNew];
    //           });
    //       },
    //       error: (err) => {
    //         console.error("CSV parse error:", err);
    //       },
    //     });
    //   };



        const sendFileBackend=async(file,status)=>{
            console.log(status);
            if(!file){
                toast.warn("No file Uploaded");
                return;
            }

            const formData=new FormData();
            formData.append("file",file);
            formData.append("status",status);

            try {
                const response=await axios.post('http://localhost:4000/api/admin/populate/DB',formData);
                if(response.status===200){
                    toast.success("Uploaded Successfully");
                    setUpdate((prev)=>!prev);
                }
                else{
                    toast.error("Failed to Upload!");
                }
            } catch (error) {
                console.log(error);
                toast.error("Something Went Wrong");
            }

        }
      const addAccount = async() => {
        if (addStudent) {
          try {
            const response=await axios.post("http://localhost:4000/api/admin/addSingle/DB",{
                data:{
                    "name":addName,
                    "password":addPassword,
                    "email":addEmail
                },
                type:"student"
            });
            if(response.status===200){
                toast.success("Student Added Successfully");
                setUpdate((prev)=>!prev);
            }
          } catch (error) {
            console.log("Something Went Wrong");
            toast.error("Something Went Wrong");
          }
        } else if (addSupervisor) {
            try {
                const response=await axios.post("http://localhost:4000/api/admin/addSingle/DB",{
                    data:{
                        "name":addName,
                        "password":addPassword,
                        "email":addEmail,
                        "fypCount":addSlots
                    },
                    type:"supervisor"
                });
                if(response.status===200){
                    toast.success("Supervisor Added Successfully");
                    setUpdate((prev)=>!prev);
                }
              } catch (error) {
                console.log("Something Went Wrong");
                toast.error("Something Went Wrong");
              }
        }
      
        setAddStudent(false);
        setAddSupervisor(false);
        setAddName("");
        setAddEmail("");
        setAddPassword("");
        setAddSlots(0);
      };      
      

    const handleExpand = (id) => {
        toggleExpand(id);
        const account = studentsData.find((acc) => acc._id === id);
        if (account) {
            setEditName(account.name);
            setEditPassword(account.password);
        }
    };

    const handleSupervisorExpand = (id) => {
        toggleExpand(id);
        const account = supervisorsData.find((acc) => acc._id === id);
        if (account) {
            setEditName(account.name);
            setEditPassword(account.password);
            setEditSlots(account.slots);
        }
        setIsSupervisor(true);
    };

    const updateAccount = (id) => {
        setStudentsData((prevData) =>
          prevData.map((account) =>
            account._id === id
              ? { ...account, name: editName, password: editPassword }
              : account
          )
        );
      };

      const updateSupervisorAccount = (id) => {
        setSupervisorsData((prevData) =>
          prevData.map((account) =>
            account._id === id
              ? { ...account, name: editName, password: editPassword, slots: editSlots }
              : account
          )
        );
      };

    const toggleSelectAllStudents = () => {
        if (selectedStudents.length === studentsData.length) {
          setSelectedStudents([]);
        } else {
          setSelectedStudents(studentsData.map((acc) => acc._id));
        }
      };
      
      const toggleSelectOneStudent = (id) => {
        setSelectedStudents((prev) =>
          prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
        );
      };

      const toggleSelectAllSupervisors = () => {
        if (selectedSupervisors.length === supervisorsData.length) {
          setSelectedSupervisors([]);
        } else {
          setSelectedSupervisors(supervisorsData.map((acc) => acc._id));
        }
      };
      
      const toggleSelectOneSupervisor = (id) => {
        setSelectedSupervisors((prev) =>
          prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
        );
      };
      

    const toggleExpand = (id) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };
      
      const handleDeleteAccount = async(id,type) => {
        console.log(type);
        try {
            const response=await axios.delete(`http://localhost:4000/api/admin/delete/DB/${id}`,{
                data:{type:type}
            });
            if(response.status===200){
                toast.success("Deleted Successfully");
                setUpdate((prev)=>!prev);
            }
        } catch (error) {
            console.log("Something Went Wrong ",error);
            toast.error("Something went wrong");
        }
      };


  return (
    <div className='flex absolute h-full w-full top-0 left-0 bg-[#f2f3f8] overflow-hidden'>
        <AdminLeftBar></AdminLeftBar>

        <div className="h-full absolute left-1/7 w-4/7 p-[2vw] overflow-y-auto">
            <h1 className="font-bold text-[#3f51b5] mb-[1vw]">Add/Edit Accounts</h1>
            <div>
                <div className="flex w-full items-center">
                    <h2 className="font-bold text-[1.5vw] text-[#444444] mb-[1vw] flex-1">Student Accounts</h2>
                    <div className="flex-1 flex items-center justify-end gap-[0.5vw]">
                        <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
                        onClick={()=>setAddStudent(true)}>Add a Student</button>
                        <label className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg">
                            Upload
                            <input type="file" accept=".csv" onChange={(e) => sendFileBackend(e.target.files[0],"student")} className="hidden" />
                        </label>
                    </div>
                </div>
                <div className="max-h-[85vh] overflow-auto mx-auto text-black shadow-lg rounded-sm">
                    <div className="min-w-[600px] max-h-[50vh] overflow-y-auto">
                        <table className="w-full border-collapse border border-[#eaebf0] text-[0.7vw]">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-[1vw] border border-[#eaebf0]">
                                        <div className="flex items-center justify-center gap-[1vw]">
                                            <label className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-[#f2f3f8] rounded-sm border border-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.length === studentsData.length}
                                                    onChange={toggleSelectAllStudents}
                                                    className="appearance-none cursor-pointer h-[1vw] w-[1vw] peer"
                                                />
                                                <svg
                                                    className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </label>
                                            #
                                        </div>
                                    </th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Name</th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Email</th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Password</th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {studentsData.map((account, index) => (
                                    <React.Fragment key={account._id}>
                                    <tr className={`border-b ${selectedStudents.includes(account._id) ? "bg-[#ccddff]" : "hover:bg-gray-50"} transition duration-300 cursor-pointer`}>
                                        <td className="py-[1vw] px-[0vw] border border-[#eaebf0] text-center" onClick={()=>{toggleSelectOneStudent(account._id)}}>
                                            <div className="flex items-center justify-center gap-[1vw]">
                                                <label
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-white border border-gray-300 rounded-sm">
                                                    <input type="checkbox" checked={selectedStudents.includes(account._id)} onChange={() => toggleSelectOneStudent(account._id)}
                                                    className="appearance-none h-[1vw] w-[1vw] cursor-pointer peer"/>
                                                    {/* Checkmark */}
                                                    <svg className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </label>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => handleExpand(account._id)}>{account.name}</td>
                                        <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => handleExpand(account._id)}>{account.email}</td>
                                        <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => handleExpand(account._id)}>{account.password}</td>
                                        <td className="border-t border-b border-r border-[#eaebf0] p-[0.5vw] text-center w-[2vw] cursor-pointer" onClick={() => handleExpand(account._id)}>
                                            <button className="flex items-center justify-center w-full h-full cursor-pointer text-[#4e5fbb]">
                                                <LucidePencil />
                                            </button>
                                        </td>
                                    </tr>

                                    </React.Fragment>
                                ))}
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="mt-[2vw]">
                <div className="flex w-full items-center">
                    <h2 className="font-bold text-[1.5vw] text-[#444444] mb-[1vw] flex-1">Supervisor Accounts</h2>
                    <div className="flex-1 flex items-center justify-end gap-[0.5vw]">
                        <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
                        onClick={()=>setAddSupervisor(true)}>Add a Supervisor</button>
                        <label className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg">
                            Upload
                            <input type="file" accept=".csv" onChange={(e) => sendFileBackend(e.target.files[0],"supervisor")} className="hidden" />
                        </label>
                    </div>
                </div>
                <div className="max-h-[85vh] overflow-auto mx-auto text-black shadow-lg rounded-sm">
                    <div className="min-w-[600px] max-h-[50vh] overflow-y-auto">
                        <table className="w-full border-collapse border border-[#eaebf0] text-[0.7vw]">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-[1vw] border border-[#eaebf0]">
                                        <div className="flex items-center justify-center gap-[1vw]">
                                            <label className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-[#f2f3f8] rounded-sm border border-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSupervisors.length === supervisorsData.length}
                                                    onChange={toggleSelectAllSupervisors}
                                                    className="appearance-none cursor-pointer h-[1vw] w-[1vw] peer"
                                                />
                                                <svg
                                                    className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </label>
                                            #
                                        </div>
                                    </th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Name</th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Email</th>
                                    
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Slots</th>
                                    <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {supervisorsData.map((account, index) => (
                                    <React.Fragment key={account._id}>
                                    <tr className={`border-b ${selectedSupervisors.includes(account._id) ? "bg-[#ccddff]" : "hover:bg-gray-50"} transition duration-300 cursor-pointer`}>
                                        <td className="py-[1vw] px-[0vw] border border-[#eaebf0] text-center" onClick={()=>{toggleSelectOneSupervisor(account._id)}}>
                                            <div className="flex items-center justify-center gap-[1vw]">
                                                <label
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-white border border-gray-300 rounded-sm">
                                                    <input type="checkbox" checked={selectedSupervisors.includes(account._id)} onChange={() => toggleSelectOneSupervisor(account._id)}
                                                    className="appearance-none h-[1vw] w-[1vw] cursor-pointer peer"/>
                                                    {/* Checkmark */}
                                                    <svg className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </label>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => handleSupervisorExpand(account._id)}>{account.name}</td>
                                        <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => handleSupervisorExpand(account._id)}>{account.email}</td>
                                        
                                        <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => handleSupervisorExpand(account._id)}>{account.fypCount}</td>
                                        <td className="border-t border-b border-r border-[#eaebf0] p-[0.5vw] text-center w-[2vw] cursor-pointer" onClick={() => handleSupervisorExpand(account._id)}>
                                            <button className="flex items-center justify-center w-full h-full cursor-pointer text-[#4e5fbb]">
                                                <LucidePencil />
                                            </button>
                                        </td>
                                    </tr>

                                    </React.Fragment>
                                ))}
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        {/* Right bar */}
        <div className="h-full w-2/7 absolute left-5/7 shadow-lg p-4 overflow-y-auto flex flex-col items-center justify-center">
            {expandedRow ? ( <> <h2 className="font-bold text-[#3f51b5] mb-[1vw] w-full text-center text-[1.5vw]">{isSupervisor ? supervisorsData.find((acc) => acc._id === expandedRow).email : studentsData.find((acc) => acc._id === expandedRow).email}</h2>
            <div className="w-full flex flex-col gap-[1vw]">
                <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Name</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Password</label>
                    <input type="text" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>
                {isSupervisor && <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Slots</label>
                    <input type="text" value={editSlots} onChange={(e) => setEditSlots(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>}
            </div>
            <div className="flex mt-[1vw] items-center w-full"><div className="flex-1 w-full flex items-center justify-start"><button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
            onClick={()=>{isSupervisor ? handleDeleteAccount(expandedRow,"supervisor") : handleDeleteAccount(expandedRow,"student");setExpandedRow()}}>Delete Account</button></div>
            <div className="flex-1 flex gap-[0.5vw] items-center justify-end">
                <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
                onClick={()=>isSupervisor ? updateSupervisorAccount(expandedRow) : updateAccount(expandedRow)}>Save</button>
                <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
                onClick={()=>setExpandedRow()}>Cancel</button>
            </div></div>
            </> ) : addStudent || addSupervisor ? <><div className="w-full flex flex-col gap-[1vw]">
                <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Name</label>
                    <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Email</label>
                    <input type="text" value={addEmail} placeholder="l21xxxx@lhr.nu.edu.pk" onChange={(e) => setAddEmail(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Password</label>
                    <input type="text" value={addPassword} onChange={(e) => setAddPassword(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>
                {addSupervisor && <div className="flex flex-col w-full">
                    <label className="font-bold text-[#333333]">Slots</label>
                    <input type="text" value={addSlots} onChange={(e) => setAddSlots(e.target.value)} className="shadow-lg text-[#333333] focus:outline-none text-[0.7vw] px-[1vw] py-[0.8vw] border border-[#eaebf0] rounded-sm w-full" />
                </div>}
            </div>
            <div className="flex mt-[1vw] items-center w-full">
                <div className="flex-1 flex gap-[0.5vw] items-center justify-end">
                    <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
                    onClick={()=>addAccount()}>Save</button>
                    <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer shadow-lg"
                    onClick={()=>{setAddStudent(false); setAddSupervisor(false); setAddName(); setAddEmail(); setAddPassword(); setAddSlots(false);}}>Cancel</button>
                </div>
            </div>
            </> : <p className="text-[#aaaaaa]">Click on an account to see details</p>}
        </div>
    </div>
  )
}