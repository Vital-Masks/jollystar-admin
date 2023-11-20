import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import IconFolderPlus from '../components/Icon/IconFolderPlus';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import IconThumbUp from '../components/Icon/IconThumbUp';
import IconTrash from '../components/Icon/IconTrash';
import IconNotesEdit from '../components/Icon/IconNotesEdit';
import IconPlus from '../components/Icon/IconPlus';

// Define an interface representing the shape of your MongoDB document
interface Member {
    _id: string;
    firstName: string; // Add "?" to indicate it's optional
    lastName: string; // Add "?" to indicate it's optional
    membershipCategory: string;
    updated_at: string;
    passportNumber: string;
    phoneNumber: string;
    memberApprovalStatus: string;
    // Add other properties as needed
}

const Pending = () => {
    const dispatch = useDispatch();
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        dispatch(setPageTitle('Dashboard Admin'));

        axios.get('http://localhost:3000/api/member/getAllmembers')
            .then(response => {
                setMembers(response.data.result);
            })
            .catch(error => {
                console.error('Error fetching data from MongoDB:', error);
            });
    }, [dispatch]);

    return (
        <div className="mb-5 space-y-5">

            <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex flex-col sm:flex-row items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                    <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                            Membership Requests
                        </h1>
                    </div>
                </div>
                <div className="sm:ltr:mr-auto sm:rtl:ml-auto flex space-x-2">
                    <form className="mx-auto mt-5 mb-5">
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                placeholder="Search Members..."
                                className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <div className="table-responsive mb-5">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Membership Type</th>
                            <th>Date Applied</th>
                            <th>NIC/Passport ID</th>
                            <th>Mobile Number</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(data => ((data.firstName && data.firstName.toLowerCase().includes(search.toLowerCase())) || (data.lastName && data.lastName.toLowerCase().includes(search.toLowerCase()))) && (data.memberApprovalStatus === 'PENDING'))
                            .map((data) => (
                                <tr key={data._id}>
                                    <td>{data._id}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.membershipCategory}</td>
                                    <td>{data.updated_at}</td>
                                    <td>{data.passportNumber}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td>
                                        <button className="badge whitespace-nowrap badge-outline-success">
                                            <NavLink to={`/view-member/${data._id}`}>View</NavLink>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Pending;
