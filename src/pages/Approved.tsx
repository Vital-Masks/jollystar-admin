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
    created_at: string;
    updated_at: string;
    passportNumber: string;
    phoneNumber: string;
    email: string;
    memberApprovalStatus: string;
    // Add other properties as needed
}

const Approved = () => {
    const dispatch = useDispatch();
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        // setLoading(false)
        dispatch(setPageTitle('Dashboard Admin'));
        const fetchData = async () => {
            let status = "APPROVED"
            try {
                const response = await axios.get('http://localhost:3000/api/member/getMemberStatusMembers/' + status);
                setMembers(response.data.result);
            } catch (error) {
                setError("error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div className="mb-5 space-y-5">

            <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex flex-col sm:flex-row items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                    <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                            Approved Members
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
                            .filter(data => ((data.firstName && data.firstName.toLowerCase().includes(search.toLowerCase())) || (data.lastName && data.lastName.toLowerCase().includes(search.toLowerCase()))) && (data.memberApprovalStatus === 'APPROVED'))
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
                                            <NavLink to={`/approved/${data._id}`}>View</NavLink>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {
                    !loading && !error && members.length === 0 &&
                    (
                        <table>
                            <tbody>
                                <tr>
                                    <td colSpan={12} style={{ textAlign: 'center' }}>
                                        No data available.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )

                }
                {
                    loading &&
                    (
                        <table>
                            <tbody>
                                <tr>
                                    <td colSpan={3} className="p-4 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="loader animate-spin mr-4"></div>
                                            {/* <span className="text-gray-600">Loading...</span> */}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )

                }

            </div>


        </div>
    );
};

export default Approved;
