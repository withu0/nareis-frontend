import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleTitle: string;
  questions: Question[];
  onComplete: (score: number) => void;
}

export function AssessmentDialog({ 
  open, 
  onOpenChange, 
  moduleTitle, 
  questions,
  onComplete 
}: AssessmentDialogProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleClose = () => {
    if (showResults) {
      onComplete(score);
    }
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    onOpenChange(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{moduleTitle} - Assessment</DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <Progress value={progress} />
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">{currentQ.question}</h3>
              <RadioGroup 
                value={answers[currentQ.id]?.toString()} 
                onValueChange={(v) => handleAnswer(currentQ.id, parseInt(v))}
              >
                {currentQ.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={answers[currentQ.id] === undefined}>
                {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            {score >= 80 ? (
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            )}
            <div>
              <h3 className="text-2xl font-bold">Your Score: {score}%</h3>
              <p className="text-muted-foreground mt-2">
                {score >= 80 ? 'Congratulations! You passed!' : 'You need 80% to pass. Try again!'}
              </p>
            </div>
            <Button onClick={handleClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
