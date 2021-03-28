import { Breadcrumb, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { SideNav, routes } from "../lib/constant/routes";
//import { getDefaultKeys } from "./layout";
import { getMenuConfig } from "./layout";
import { getUserRole } from "../lib/services/storage";
import styles from "../styles/Breadcrumb.module.css";
import { useEffect, useState } from "react";



const essential = () => {
  const userRole = "manager";
  // const [userRole, setUserRole] = useState();
  // useEffect(() => {
  //   setUserRole(getUserRole());
  // }, [])
  
  const sideNav = routes.get(userRole);
  //const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);
  const openKey = defaultOpenKeys[0] ? defaultOpenKeys[0].split("_")[0] : "";
  const selectedKey = defaultSelectedKeys[0].split("_")[0];

  return {
    userRole,
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

const GeneratePath = (data: SideNav[], selectedKey: string) => {
  const { userRole } = essential();
  const string = "/dashboard";
  const Path = data.map((item) => {
    if (item.subNav && item.subNav.length) {
      return GeneratePath(item.subNav, selectedKey).map((item: string) => item);
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

const getListLink = () => {
  const { sideNav, selectedKey } = essential();
  const array = GeneratePath(sideNav, selectedKey);
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

const detailPath = (): string[] => {
  const { openKey, selectedKey } = essential();
  const detail = isDetailPath();

  if (detail) {
    const breadcrumbPath = [openKey, selectedKey, "Detail"];
    return breadcrumbPath;
  } else {
    const breadcrumbPath = [openKey, selectedKey];
    return breadcrumbPath;
  }
};

export default function BreadCrumb() {
  // const [userRole, setUserRole] = useState(null);
  // useEffect(() => {
  //   getUserRole("")
  //     .then((res: IResponse) => {
  //       const role = res.data;
  //       setUserRole(role);
  //     })
  //     .catch((err) => message.error(err));
  // });
  const {userRole} = essential();
  const breadcrumbPath = detailPath();
  const link = getListLink();
  const breadcrumbPathLength = breadcrumbPath.length;

  //check if it is detail page
  //if it is not
  //CMS(link)/SideBarName/Open key
  //if it is
  //CMS(link)/SideBarName(with link)/Open key

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
