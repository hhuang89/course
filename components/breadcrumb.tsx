import { Breadcrumb, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { SideNav, routes } from "../lib/constant/routes";
import { getDefaultKeys } from "./layout";
//import { getMenuConfig } from "./layout";
import { getUserRole } from "../lib/services/storage";
import styles from "../styles/Breadcrumb.module.css";
import { useEffect, useState } from "react";


const essential = (userRole: string) => {
  const sideNav = routes.get(userRole);
  const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(sideNav);
  //const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);
  const openKey = defaultOpenKeys[0] ? defaultOpenKeys[0].split("_")[0] : "";
  const selectedKey = defaultSelectedKeys[0].split("_")[0];

  return {
    sideNav,
    openKey,
    selectedKey,
  };
};

const isDetailPath = (path: string): boolean => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

const generatePath = (data: SideNav[], selectedKey: string, userRole: string) => {
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
  // const { sideNav, selectedKey } = essential(useRole);
  // const array = generatePath(sideNav, selectedKey, useRole);
  // console.log(array);

  // let link = "";
  // array.forEach((element: string[]) => {
  //   if (element) {
  //     if (element[0]) {
  //       link = element[0];
  //     }
  //   }
  // });
   const router = useRouter();
   const link = router.pathname.split('/').slice(0, router.pathname.split('/').length - 1).join('/');
  return link;
};

const detailPath = (userRole: string): string[] => {
  const router = useRouter();
  const path = router.pathname;
  const { openKey, selectedKey } = essential(userRole);
  const detail = isDetailPath(path);

  return detail? [openKey, selectedKey, "Detail"] : [openKey, selectedKey];
};

export default function BreadCrumb() {
  const router = useRouter();
  const paths = router.pathname.split('/').slice(1);
  const root = '/' + paths.slice(0, 2).join('/');

  const userRole = getUserRole();
  const breadcrumbPath = detailPath(userRole);
  const link = getListLink(userRole);

  const breadcrumbPathLength = breadcrumbPath.length;

  /*check if it is detail page
  if it is not
  CMS(link)/SideBarName/Open key
  if it is
  CMS(link)/SideBarName(with link)/Open key*/

  return (
    <Breadcrumb className={styles.breadcrumb}>
      <Breadcrumb.Item>
        <Link href={root}>{`CMS ${userRole.toUpperCase()} SYSTEM`}</Link>
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
