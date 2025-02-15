import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../utils/utils';

// Define an interface representing the shape of your MongoDB document
interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  membershipCategory: string;
  created_at: string;
  updated_at: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
  memberApprovalStatus: string;
  Reason: string;
}

const Pending = () => {
  const dispatch = useDispatch();
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setPageTitle('Pending Members'));

    const fetchData = async () => {
      let status = 'PENDING';
      try {
        const response = await axios.get('http://localhost:3000/api/member/getMemberStatusMembers/' + status);
        setMembers(response.data.result);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Function to download CSV
  const downloadCSV = () => {
    const headers = [
      'First Name', 
      'Last Name', 
      'Membership Type', 
      'Date Applied', 
      'NIC/Passport ID', 
      'Mobile Number', 
      'Email', 
      'Approval Status', 
      'Reason'
    ];

    const rows = [
      headers, // Header row
      ...members
        .filter(data => data.memberApprovalStatus === 'PENDING') // Filtering PENDING members
        .map(data => [
          data.firstName,
          data.lastName,
          data.membershipCategory,
          formatDate(data.updated_at),
          data.passportNumber,
          data.phoneNumber,
          data.email,
          data.memberApprovalStatus,
          data.Reason,
        ]),
    ];

    // Convert rows into CSV format
    const csvContent = rows.map(row => row.join(',')).join('\n');

    // Create a blob from CSV content and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pending_members.csv';
    link.click();
  };

  return (
    <div className="mb-5 space-y-5">
      <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex flex-col sm:flex-row items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
          <div className="space-y-2 prose dark:prose-headings:text-white-dark mt-10 mb-10">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Membership Requests</h1>
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

      {/* Download Button */}
      <div className="mb-4 flex justify-end">
      <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={downloadCSV}
        >
          Download Table Data
        </button>
      </div>

      <div className="table-responsive mb-5">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Membership Type</th>
              <th>Date Applied</th>
              <th>NIC/Passport ID</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Approval Status</th>
              <th>Reason</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members &&
              members
                .filter(
                  (data) =>
                    ((data.firstName &&
                      data.firstName.toLowerCase().includes(search.toLowerCase())) ||
                      (data.lastName && data.lastName.toLowerCase().includes(search.toLowerCase()))) &&
                    data.memberApprovalStatus === 'PENDING'
                )
                .map((data) => (
                  <tr key={data._id}>
                    <td>{data.firstName}</td>
                    <td>{data.lastName}</td>
                    <td>{data.membershipCategory}</td>
                    <td>{formatDate(data.updated_at)}</td>
                    <td>{data.passportNumber}</td>
                    <td>{data.phoneNumber}</td>
                    <td>{data.email}</td>
                    <td>{data.memberApprovalStatus}</td>
                    <td>{data.Reason}</td>
                    <td>
                      <button className="badge whitespace-nowrap badge-outline-success">
                        <NavLink to={`/view-member/${data._id}`}>View</NavLink>
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && !error && members.length === 0 && (
          <table>
            <tbody>
              <tr>
                <td colSpan={12} style={{ textAlign: 'center' }}>
                  No data available.
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {loading && (
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
        )}
      </div>
    </div>
  );
};

export default Pending;
