import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { SideNav, routes } from "../lib/constant/routes";
import {
  generatePath,
  getActivePath,
  curryingGeneratePath,
  getDefaultKeys,
} from "./layout";

const isDetailPath = (): boolean => {
  const router = useRouter();
  let signal = false;
  router.pathname.split("/").forEach((item) => {
    signal = item === "[id]";
  });

  return signal;
};

const detailPath = (): string[] => {
  const userRole = "manager";
  const sideNav = routes.get(userRole);
  const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(sideNav);
  const openKey = defaultOpenKeys[0].split("_")[0];
  const selectedKey = defaultSelectedKeys[0].split("_")[0];
  const detail = isDetailPath();
  
  let path = "";
  sideNav.map((item) => {
    if (item.subNav && item.subNav.length) {
      item.subNav.map((item) => {
        if (selectedKey === item.label) {
          path = ["/dashboard", userRole, item.path].join("/");
        }
      });
    }
  });
  console.log(path);

  if (detail) {
    const breadcrumbPath = [

      openKey,
      selectedKey,
      "Detail",
    ];

    return breadcrumbPath;
  } else {
    const breadcrumbPath = [openKey, selectedKey];
    return breadcrumbPath;
  }
};

export default function BreadCrumb() {
  const userRole = "manager";
  const breadcrumbPath = detailPath();
  //check if it is detail page
  //if it is not
  //CMS(link)/SideBarName/Open key
  //if it is
  //CMS(link)/SideBarName(with link)/Open key

  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link href="/">{`CMS ${userRole.toUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {breadcrumbPath.map((item, index) => {
        return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
}
