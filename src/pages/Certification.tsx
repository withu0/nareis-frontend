import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { certificationModules } from '@/data/certificationData';
import { ModuleCard } from '@/components/certification/ModuleCard';
import { CertificationProgress } from '@/components/certification/CertificationProgress';
import { AssessmentDialog } from '@/components/certification/AssessmentDialog';
import { CertificateDownload } from '@/components/certification/CertificateDownload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';
import { BookOpen, Award } from 'lucide-react';
import { toast } from 'sonner';

const mockQuestions = [
  {
    id: '1',
    question: 'What is the most important factor in real estate investment?',
    options: ['Location', 'Price', 'Size', 'Age'],
    correctAnswer: 0
  },
  {
    id: '2',
    question: 'What does NOI stand for?',
    options: ['Net Operating Income', 'New Owner Investment', 'National Operating Index', 'None'],
    correctAnswer: 0
  },
  {
    id: '3',
    question: 'What is a cap rate?',
    options: ['A type of loan', 'A measurement of return', 'A property tax', 'An insurance premium'],
    correctAnswer: 1
  }
];

export default function Certification() {
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [modules, setModules] = useState(certificationModules);
  const [certification, setCertification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCertification();
    }
  }, [user]);

  const loadCertification = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCertification(data);
        const completions = data.module_completions || [];
        setModules(certificationModules.map(m => ({
          ...m,
          completed: completions.includes(m.id),
          score: data.scores?.[m.id] || 0
        })));
      } else {
        await createCertification();
      }
    } catch (error) {
      console.error('Error loading certification:', error);
      toast.error('Failed to load certification');
    } finally {
      setLoading(false);
    }
  };

  const createCertification = async () => {
    try {
      const certNumber = `NAREI-${Math.floor(100000 + Math.random() * 900000)}`;
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          user_id: user?.id,
          certificate_number: certNumber,
          module_completions: [],
          scores: {},
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      setCertification(data);
    } catch (error) {
      console.error('Error creating certification:', error);
    }
  };

  const completedModules = modules.filter(m => m.completed).length;
  const progress = Math.round((completedModules / modules.length) * 100);
  const isCertified = progress === 100;

  const handleStartModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    setShowAssessment(true);
  };

  const handleAssessmentComplete = async (score: number) => {
    if (selectedModule && score >= 80) {
      try {
        const updatedModules = modules.map(m => 
          m.id === selectedModule ? { ...m, completed: true, score } : m
        );
        setModules(updatedModules);

        const completions = updatedModules.filter(m => m.completed).map(m => m.id);
        const scores = updatedModules.reduce((acc, m) => {
          if (m.score) acc[m.id] = m.score;
          return acc;
        }, {} as Record<string, number>);

        const allComplete = completions.length === certificationModules.length;
        const updateData: any = {
          module_completions: completions,
          scores,
          status: allComplete ? 'completed' : 'in_progress',
          updated_at: new Date().toISOString()
        };

        if (allComplete) {
          updateData.certification_date = new Date().toISOString();
          updateData.expiration_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        }

        const { error } = await supabase
          .from('certifications')
          .update(updateData)
          .eq('id', certification.id);

        if (error) throw error;

        await loadCertification();
        toast.success('Module completed successfully!');
      } catch (error) {
        console.error('Error updating certification:', error);
        toast.error('Failed to save progress');
      }
    }
    setShowAssessment(false);
    setSelectedModule(null);
  };

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BackButton />
      <div className="mb-8">

        <h1 className="text-4xl font-bold mb-2">Certification Portal</h1>
        <p className="text-muted-foreground">
          Complete all required modules to earn your NAREIS Certified Professional credential
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <CertificationProgress
            status={certification?.status || 'in_progress'}
            progress={progress}
            certificationDate={certification?.certification_date}
            expirationDate={certification?.expiration_date}
            certificateNumber={certification?.certificate_number}
          />
        </div>
        {isCertified && certification?.certificate_number && (
          <CertificateDownload
            certificateNumber={certification.certificate_number}
            certificationDate={certification.certification_date}
          />
        )}
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Requirements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              onStart={handleStartModule}
              locked={index > 0 && !modules[index - 1].completed}
            />
          ))}
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Certification Requirements</CardTitle>
              <CardDescription>What you need to become a NAREIS Certified Professional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Required Modules</h3>
                <p className="text-sm text-muted-foreground">Complete all 6 core modules with a passing score of 80% or higher</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Assessment</h3>
                <p className="text-sm text-muted-foreground">Pass the assessment at the end of each module</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Renewal</h3>
                <p className="text-sm text-muted-foreground">Certification is valid for 1 year and requires renewal</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedModuleData && (
        <AssessmentDialog
          open={showAssessment}
          onOpenChange={setShowAssessment}
          moduleTitle={selectedModuleData.title}
          questions={mockQuestions}
          onComplete={handleAssessmentComplete}
        />
      )}
    </div>
  );
}
