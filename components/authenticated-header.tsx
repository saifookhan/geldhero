import {useState} from 'react'
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut
} from "lucide-react";

type AuthenticatedHeaderProps = {
  user : any,
  handleSignOut : () => void
}


const AuthenticatedHeader = ({ user, handleSignOut }:AuthenticatedHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">GeldHero</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-5 w-5" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader