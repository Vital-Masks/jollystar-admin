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
    firstName: string;
    lastName: string;
    membershipCategory: string;
    updated_at: string;
    passportNumber: string;
    phoneNumber: string;
    memberApprovalStatus: string;
    // Add other properties as needed
}

const Dashboard = () => {
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
                            <th></th>
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
            <button type="button" className="btn btn-outline-success rounded-full float-right">
                <NavLink to="/pending-requests">See More</NavLink>
            </button>
        </div>
    );
};

export default Dashboard;
