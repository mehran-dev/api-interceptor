// <import react
import { useEffect, useContext } from "react";
// import react>

// <import next
import { useRouter } from "next/router";
// import next>

// <import services
import { Roles } from '@/lib/services';
// import services>

// <import packages
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
// import packages>

// <import RQ
import { useMutation } from '@tanstack/react-query';
// import RQ>

// <import context
import { accessesMapContext } from '@/lib/context/index.ts';
// import context>

// <import styles
import styles from './panelLayout.module.scss'
// import styles>

// <components
import { Header, Sidebar } from '&/layout/index.ts';
// components>

// <import types
import { LayoutProps } from '@/lib/types/layout.types';
// import types>

/**
 * @description Panel Layout
 */
export default function PanelLayout({children} : LayoutProps) {

  const router = useRouter();

  const accessesMap = useContext(accessesMapContext);

  const getRoleMapApiCall = useMutation({ mutationFn: async (id : string) => await new Roles().getRole(id) });

  function redirectToLogin() {

    router.push('/login');

  };

  async function getAccessMap(roleId : string) {

    const roleResponse = await getRoleMapApiCall.mutateAsync(roleId);

    if (roleResponse?.type) {

      const AccessMapList = roleResponse.data?.AccessMap?.accessList;

      if (AccessMapList) {

        accessesMap?.setAccessesMapState(AccessMapList);

      } else {

        redirectToLogin();

      };

    };
    
  };

  useEffect(() => {

    const acc = accessesMap?.accessesMapState;

    if (acc === null) {

      const roleId = Cookies.get("roleId");

      if (roleId) {

        getAccessMap(roleId);

      } else {

        redirectToLogin();

      };

    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[accessesMap?.accessesMapState]);

  useEffect(() => {

    const token = Cookies.get("token");

    if (!token) {

      toast.error("ابتدا وارد شوید");

      redirectToLogin();

    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[router]);

  return (
    <div className={styles.panelLayout}>
      <Sidebar mode={"back"} />
      <Sidebar mode={"main"}/>
      <div className={styles.layoutContainer}>
        <Header/>
        <div className={styles.childContainer}>
          {children}
        </div>
      </div>
    </div>
  );
};