import {
    DashboardOutlined,
    DeploymentUnitOutlined,
    EditOutlined,
    FileAddOutlined,
    ProjectOutlined,
    ReadOutlined,
    SolutionOutlined,
    TeamOutlined,
    MessageOutlined
  } from '@ant-design/icons';
  import React from 'react';
  import { Role } from '../model/Role'
  import { Role as Roles} from '../model/Role'
  /**
   * router path
   */
  export enum RoutePath {
    manager = 'manager',
    teachers = 'teachers',
    students = 'students',
    courses = 'courses',
    addCourse = 'add-course',
    editCourse = 'edit-course',
    message = 'message',
  }
  
  export interface SideNav {
    icon?: JSX.Element;
    label: string;
    path: string[];
    selected?: boolean;
    subNav?: SideNav[];
    hide?: boolean;
  }
  
  const students: SideNav = {
    path: [],
    label: 'Student',
    icon: <SolutionOutlined />,
    subNav: [
      { path: [RoutePath.students], label: 'Student List', icon: <TeamOutlined /> },
    ],
  };
  
  const courses: SideNav = {
    path: [],
    label: 'Course',
    icon: <ReadOutlined />,
    subNav: [
      { path: [RoutePath.courses], label: 'All Courses', icon: <ProjectOutlined /> },
      { path: [RoutePath.addCourse], label: 'Add Course', icon: <FileAddOutlined /> },
      { path: [RoutePath.editCourse], label: 'Edit Course', icon: <EditOutlined /> },
    ],
  };
  
  const teachers: SideNav = {
    path: [],
    label: 'Teacher',
    icon: <DeploymentUnitOutlined />,
    subNav: [
      {
        path: [RoutePath.teachers],
        label: 'Teacher List',
        icon: <TeamOutlined />,
      },
    ],
  };
  
  const overview: SideNav = {
    path: [],
    label: 'Overview',
    icon: <DashboardOutlined />,
  };

  const message: SideNav = {
    path: [RoutePath.message],
    label: 'Message',
    icon: <MessageOutlined/>
  }
  
  export const routes: Map<string, SideNav[]> = new Map([
    ["manager", [overview, students, teachers, courses, message]],
  ]);
  