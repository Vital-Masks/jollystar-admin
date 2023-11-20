import { lazy } from 'react';
import Pending from '../pages/Pending';
import AddMember from '../pages/AddMember';
import ApprovedMember from '../pages/ApprovedMember';
import Approved from '../pages/Approved';
import Declined from '../pages/Declined';
import DeclineRequest from '../pages/DeclineRequest';
import RemovedMembers from '../pages/RemovedMembers';
import FileManagement from '../pages/FileManagement';

import Posts from '../pages/Posts';
import AddNewMember from '../pages/AddNewMember';
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Error = lazy(() => import('../components/Error'));


const routes = [
    // dashboard
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/pending-requests',
        element: <Pending />,
    },
    {
        path: '/approved-member',
        element: <Approved />,
    },
    {
        path: '/approved/:memberId',
        element: <ApprovedMember />,
    },
    {
        path: '/declined',
        element: <Declined />,
    },
    {
        path: '/declined-requests/:memberId',
        element: <DeclineRequest />,
    },
    {
        path: '/file-management',
        element: <FileManagement />,
    },
    {
        path: '/posts',
        element: <Posts />,
    },
    {
        path: '/removed-members/:memberId',
        element: <RemovedMembers />,
    },
    {
        path: '/view-member/:memberId',
        element: <AddMember />,
    },
    {
        path: '/add-new-members',
        element: <AddNewMember />,
    },
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
