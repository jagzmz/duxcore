import React from "react";
import { Header } from "../../components/layout/Header";
import { Layout } from "../../components/Layout";
import { CollectionsArray } from "../../components/serviceCollections/CollectionsArray";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";

interface HomePageProps { }

export const HomePage: PageComponent<HomePageProps> = () => {
  const { revokeAllRefreshTokens } = useAuth();


  /*
        <button
        onClick={() => revokeAllRefreshTokens()}
        className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 rounded-5"
      >Revoke All Refresh Tokens</button>
      */

  return (
    <Layout>
      <CollectionsArray />
    </Layout>
  );
};

HomePage.requiresAuth = true;
