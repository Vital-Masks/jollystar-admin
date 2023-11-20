import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import IconThumbUp from '../components/Icon/IconThumbUp';
import IconTrash from '../components/Icon/IconTrash';
import IconFolderPlus from '../components/Icon/IconFolderPlus';
import IconNotesEdit from '../components/Icon/IconNotesEdit';
import { Link, NavLink } from 'react-router-dom';
import IconPlus from '../components/Icon/IconPlus';
import IconHome from '../components/Icon/IconHome';
import IconDollarSignCircle from '../components/Icon/IconDollarSignCircle';
import IconPhone from '../components/Icon/IconPhone';
import IconLinkedin from '../components/Icon/IconLinkedin';
import IconTwitter from '../components/Icon/IconTwitter';
import IconFacebook from '../components/Icon/IconFacebook';
import IconGithub from '../components/Icon/IconGithub';
import IconUser from '../components/Icon/IconUser';
import IconLaptop from '../components/Icon/IconLaptop';
import IconPlayCircle from '../components/Icon/IconPlayCircle';
import IconAt from '../components/Icon/IconAt';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import themeConfig from '../theme.config';
import IconEdit from '../components/Icon/IconEdit';
import IconUserPlus from '../components/Icon/IconUserPlus';
import IconUsers from '../components/Icon/IconUsers';
import IconMenuUsers from '../components/Icon/Menu/IconMenuUsers';
import axios from 'axios';

interface Member {
    _id: string;
    firstName: string; // Add "?" to indicate it's optional
    lastName: string; // Add "?" to indicate it's optional
    membershipCategory: string;
    updated_at: string;
    passportNumber: string;
    phoneNumber: string;
    memberApprovalStatus: string;
    declinedMessage: string;
    // Add other properties as needed
}


const Declined = () => {
    const dispatch = useDispatch();
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState<string>('');
    const [tabs, setTabs] = useState<string>('requests');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

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
                        Declined Membership Requests
                    </h1>
                    </div>
                </div>
            </div>

            

                {/* Body Start */}

                <div>
            
                <div className="pt-5">
                
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('requests')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'requests' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser />
                                Declined Member Requests
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('members')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'members' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUsers />
                                Removed Members
                            </button>
                        </li>
                        
                        
                    </ul>
                </div>
                {tabs === 'requests' ? (
                    <div>
                   <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                   <h1>
                       Declined Membership Requests
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
                            <th>Date Declined</th>
                            <th>Reason</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(data => ((data.firstName && data.firstName.toLowerCase().includes(search.toLowerCase())) || (data.lastName && data.lastName.toLowerCase().includes(search.toLowerCase()))) && (data.memberApprovalStatus === 'DECLINED'))
                            .map((data) => (
                                <tr key={data._id}>
                                    <td>{data._id}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.membershipCategory}</td>
                                    <td>{data.updated_at}</td>
                                    <td>{data.declinedMessage}</td>
                                    <td>
                                        <button className="badge whitespace-nowrap badge-outline-success">
                                            <NavLink to={`/declined-requests/${data._id}`}>View</NavLink>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                   </div>
                   </div>
                    
                ) : (
                    ''
                )}
                {tabs === 'members' ? (
                    <div>
                    <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
                    <h1>
                        Removed Memberships
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
                            <th>Date Declined</th>
                            <th>Reason</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(data => ((data.firstName && data.firstName.toLowerCase().includes(search.toLowerCase())) || (data.lastName && data.lastName.toLowerCase().includes(search.toLowerCase()))) && (data.memberApprovalStatus === 'REMOVED'))
                            .map((data) => (
                                <tr key={data._id}>
                                    <td>{data._id}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.membershipCategory}</td>
                                    <td>{data.updated_at}</td>
                                    <td>{data.declinedMessage}</td>
                                    <td>
                                        <button className="badge whitespace-nowrap badge-outline-success">
                                            <NavLink to={`/removed-members/${data._id}`}>View</NavLink>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                    </div>
                    </div>

                ) : (
                    ''
                )}
            </div>
        </div>

                {/* Body End */}







        </div>



        
    );
};

export default Declined;
