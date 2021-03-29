import { Breadcrumb, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { SideNav, routes } from "../lib/constant/routes";
//import { getDefaultKeys } from "./layout";
import { getMenuConfig } from "./layout";
import { getUserRole } from "../lib/services/storage";
// import { useUserRole } from "../lib/services/login-state";
import styles from "../styles/Breadcrumb.module.css";
import { useEffect, useState } from "react";

// const userRoleState = () => {
//   const [userRole, setUserRole] = useState('');
//   useEffect(() => {
//     const user = JSON.parse(localStorage?.getItem("auth")).role;
//     if (!!user) {
//       setUserRole(user);
//     }
    
//   });

//   return userRole;
// }

const essential = (userRole: string) => {
  //const userRole = userRoleState();
  const sideNav = routes.get(userRole);
  //const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);
  const openKey = defaultOpenKeys[0] ? defaultOpenKeys[0].split("_")[0] : "";
  const selectedKey = defaultSelectedKeys[0].split("_")[0];

  return {
    //userRole,
    sideNav,
    openKey,
    selectedKey,
  };
};

const isDetailPath = (): boolean => {
  const router = useRouter();
  let signal = false;
  router.pathname.split("/").forEach((item) => {
    signal = item === "[id]";
  });

  return signal;
};

const generatePath = (data: SideNav[], selectedKey: string, userRole: string) => {
  //const { userRole } = essential();
  const string = "/dashboard";
  const Path = data.map((item) => {
    if (item.subNav && item.subNav.length) {
      return generatePath(item.subNav, selectedKey, userRole).map((item: string) => item);
    } else {
      if (selectedKey === item.label) {
        const path = [string, userRole, item.path].join("/");
        return path;
      } else {
        return null;
      }
    }
  });

  return Path;
};

const getListLink = (useRole: string) => {
  const { sideNav, selectedKey } = essential(useRole);
  const array = generatePath(sideNav, selectedKey, useRole);
  let link = "";
  array.forEach((element: string[]) => {
    if (element) {
      if (element[0]) {
        link = element[0];
      }
    }
  });
  return link;
};

const detailPath = (userRole: string): string[] => {
  const { openKey, selectedKey } = essential(userRole);
  const detail = isDetailPath();

  return detail? [openKey, selectedKey, "Detail"] : [openKey, selectedKey];

  // if (detail) {
  //   const breadcrumbPath = [openKey, selectedKey, "Detail"];
  //   return breadcrumbPath;
  // } else {
  //   const breadcrumbPath = [openKey, selectedKey];
  //   return breadcrumbPath;
  // }
};

const useUserRole = () => {
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const user = getUserRole();
    setUserRole(user);
  });

  return userRole;
}

export default function BreadCrumb() {
  // const [userRole, setUserRole] = useState('');
  // useEffect(() => {
  //   const user = getUserRole();
  //   setUserRole(user);
  // });
  const userRole = useUserRole();
  const breadcrumbPath = detailPath("manager");
  const link = getListLink("manager");
  const breadcrumbPathLength = breadcrumbPath.length;

  /*check if it is detail page
  if it is not
  CMS(link)/SideBarName/Open key
  if it is
  CMS(link)/SideBarName(with link)/Open key*/

  return (
    <Breadcrumb className={styles.breadcrumb}>
      <Breadcrumb.Item>
        <Link href="/">{`CMS ${userRole.toUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {breadcrumbPath.map((item, index) => {
        if (breadcrumbPathLength === 2) {
          return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
        } else {
          if (index === breadcrumbPath.length - 2) {
            return (
              <Breadcrumb.Item key={index}>
                <Link href={link}>{item}</Link>
              </Breadcrumb.Item>
            );
          } else {
            return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
          }
        }
      })}
    </Breadcrumb>
  );
}
