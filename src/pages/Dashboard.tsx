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
    Reason:string
}

const Dashboard = () => {
    const dispatch = useDispatch();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('Dashboard Admin'));

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/member/getAllmembers/' );
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
        <div>
            

                <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                    <h1>
                        Membership Requests
                    </h1>
                    
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
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(data => ((data.firstName && data.firstName.toLowerCase().includes(search.toLowerCase())) || (data.lastName && data.lastName.toLowerCase().includes(search.toLowerCase()))) )
                            .slice(0, 15)
                            .map((data) => (
                                <tr key={data._id}>
                                    <td>{data._id}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.membershipCategory}</td>
                                    <td>{data.updated_at}</td>
                                    <td>{data.passportNumber}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td>View</td>
                                </tr>
                            ))
                        }
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
                                            <span className="text-gray-600">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )

                }
            </div>
            {members.length > 0 && (
                <button type="button" className="btn btn-outline-success rounded-full float-right">
                    <NavLink to="/pending-requests">See More</NavLink>
                </button>
            )}
        </div>
    );
};

export default Dashboard;
