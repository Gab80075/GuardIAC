
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import Footer from './components/Footer';
import Wizard from './components/Wizard';
import PolicyViewer from './components/PolicyViewer';
import Dashboard from './components/Dashboard';
import ExpertAnalyzer from './components/ExpertAnalyzer';
import ComplaintGenerator from './components/ComplaintGenerator';
import ComplaintViewer from './components/ComplaintViewer';
import LegalAssistant from './components/LegalAssistant';
import NotebookLMImporter from './components/NotebookLMImporter';
import Login from './components/Login';
import ClientManager from './components/ClientManager';
import { PolicyData, ComplaintData, User, ClientRecord } from './types';
import ComplianceAudit from './components/ComplianceAudit';

type View = 'dashboard' | 'wizard' | 'policyViewer' | 'expertAnalyzer' | 'complaintGenerator' | 'complaintViewer' | 'notebookLMImporter' | 'clientManager' | 'complianceAudit';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGuardianAssistant, setShowGuardianAssistant] = useState(false);
  const [guardianAssistantKey, setGuardianAssistantKey] = useState(0);

  // Policy-related state
  const [generatedPolicy, setGeneratedPolicy] = useState<string | null>(null);
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);

  // Complaint-related state
  const [generatedComplaint, setGeneratedComplaint] = useState<string | null>(null);
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('guardiacUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('guardiacUser');
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('guardiacUser', JSON.stringify(loggedInUser));

    try {
        const recordsJSON = localStorage.getItem('clientRecords');
        const records: ClientRecord[] = recordsJSON ? JSON.parse(recordsJSON) : [];
        const newRecord: ClientRecord = { ...loggedInUser, loggedInAt: Date.now() };
        records.push(newRecord);
        localStorage.setItem('clientRecords', JSON.stringify(records));
    } catch (error) {
        console.error("Failed to update client records", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('guardiacUser');
    setCurrentView('dashboard');
  };

  const handleGenerationStart = () => {
      setIsLoading(true);
  };

  // --- Policy Flow Handlers ---
  const handlePolicyGenerated = (policy: string, data: PolicyData) => {
    setGeneratedPolicy(policy);
    setPolicyData(data);
    setIsLoading(false);
    setCurrentView('policyViewer');
  };

  const handlePolicyReset = () => {
    setGeneratedPolicy(null);
    setPolicyData(null);
    setIsLoading(false);
    setCurrentView('dashboard');
  };
  
  // --- Complaint Flow Handlers ---
  const handleComplaintGenerated = (complaint: string, data: ComplaintData) => {
    setGeneratedComplaint(complaint);
    setComplaintData(data);
    setIsLoading(false);
    setCurrentView('complaintViewer');
  };
  
  const handleComplaintReset = () => {
    setGeneratedComplaint(null);
    setComplaintData(null);
    setIsLoading(false);
    setCurrentView('dashboard');
  };

  // --- Navigation ---
  const goToDashboard = () => setCurrentView('dashboard');
  const goToWizard = () => setCurrentView('wizard');
  const goToExpertAnalyzer = () => setCurrentView('expertAnalyzer');
  const goToComplaintGenerator = () => setCurrentView('complaintGenerator');
  const goToNotebookLMImporter = () => setCurrentView('notebookLMImporter');
  const goToClientManager = () => setCurrentView('clientManager');
  const goToComplianceAudit = () => setCurrentView('complianceAudit');

  const handleGuardianLegalClick = () => {
    setGuardianAssistantKey(prevKey => prevKey + 1);
    setShowGuardianAssistant(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'wizard':
        return <Wizard 
                  onPolicyGenerated={handlePolicyGenerated} 
                  onGenerationStart={handleGenerationStart} 
                  isLoading={isLoading}
                  onBackToDashboard={goToDashboard}
                />;
      case 'policyViewer':
        return generatedPolicy && policyData ? (
          <PolicyViewer 
            policyText={generatedPolicy} 
            onReset={handlePolicyReset} 
            policyData={policyData}
          />
        ) : null;
      case 'expertAnalyzer':
        return <ExpertAnalyzer onBackToDashboard={goToDashboard} />;
      case 'complaintGenerator':
        if (!user) return null; // Should not happen due to login wall
        return <ComplaintGenerator
                  currentUser={user}
                  onComplaintGenerated={handleComplaintGenerated}
                  onGenerationStart={handleGenerationStart}
                  isLoading={isLoading}
                  onBackToDashboard={goToDashboard}
                />;
      case 'complaintViewer':
        return generatedComplaint && complaintData ? (
          <ComplaintViewer
            complaintText={generatedComplaint}
            onReset={handleComplaintReset}
            complaintData={complaintData}
          />
        ) : null;
       case 'notebookLMImporter':
        return <NotebookLMImporter user={user!} onBackToDashboard={goToDashboard} />;
       case 'clientManager':
        return <ClientManager onBackToDashboard={goToDashboard} />;
       case 'complianceAudit':
        return <ComplianceAudit onBackToDashboard={goToDashboard} />;
      case 'dashboard':
      default:
        return <Dashboard 
                  onStartGeneration={goToWizard} 
                  onStartExpertConsultation={goToExpertAnalyzer}
                  onStartComplaintGeneration={goToComplaintGenerator}
                  onStartNotebookLMImport={goToNotebookLMImporter}
                  onStartComplianceAudit={goToComplianceAudit}
               />;
    }
  };
  
  if (!user) {
    return (
        <div className="bg-dark-bg">
            <Login onLogin={handleLogin} />
        </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg text-dark-text-primary font-sans">
      <Header 
        user={user}
        onLogout={handleLogout}
        onNewPolicyClick={goToWizard} 
        onComplaintClick={goToComplaintGenerator} 
        onDashboardClick={goToDashboard} 
        onGuardianLegalClick={handleGuardianLegalClick} 
        onClientManagerClick={goToClientManager}
      />
      <main className="flex-grow flex-1 flex justify-center py-5 px-4 sm:px-10">
        <div className="w-full max-w-screen-xl">
           {renderContent()}
        </div>
      </main>
      <Footer />

      {showGuardianAssistant && (
         <React.Fragment key={guardianAssistantKey}>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={() => setShowGuardianAssistant(false)}></div>
            <div
                className="fixed bottom-0 right-0 z-50 bg-dark-bg rounded-t-2xl md:rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-lg md:bottom-6 md:right-6 flex flex-col h-[80vh] md:max-h-[85vh] border border-dark-border"
                role="dialog"
                aria-modal="true"
                aria-labelledby="assistant-title"
            >
                <LegalAssistant 
                    documentText="" 
                    contextData={null} 
                    onClose={() => setShowGuardianAssistant(false)}
                />
            </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
