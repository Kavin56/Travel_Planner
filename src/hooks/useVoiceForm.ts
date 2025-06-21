import { useState, useCallback } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { formVoiceService } from '@/services/formVoiceService';
import { useToast } from '@/hooks/use-toast';

type FieldName = 'destination' | 'numberOfDays';

interface UseVoiceFormParams {
  setValue: UseFormSetValue<any>;
  triggerSubmit: () => void;
}

export const useVoiceForm = ({ setValue, triggerSubmit }: UseVoiceFormParams) => {
  const [listeningField, setListeningField] = useState<FieldName | null>(null);
  const { toast } = useToast();

  const startListening = useCallback((field: FieldName) => {
    toast({
      title: 'Listening...',
      description: `Please say the ${field === 'destination' ? 'destination' : 'number of days'}.`,
    });
    setListeningField(field);

    const handleResult = (transcript: string) => {
      let processedTranscript = transcript.trim();
      
      if (field === 'numberOfDays') {
        const numbers = processedTranscript.match(/\d+/);
        processedTranscript = numbers ? numbers[0] : '1';
        toast({
          title: 'Got it!',
          description: `Set days to ${processedTranscript}. Submitting...`,
        });
      } else {
         toast({
          title: 'Got it!',
          description: `Your destination is ${processedTranscript}. Now for the days...`,
        });
      }

      setValue(field, processedTranscript, { shouldValidate: true });
      setListeningField(null);

      if (field === 'destination') {
        setTimeout(() => startListening('numberOfDays'), 200);
      } else if (field === 'numberOfDays') {
        setTimeout(() => triggerSubmit(), 500);
      }
    };

    const handleError = (error: string) => {
      toast({
        title: 'Voice Input Error',
        description: error,
        variant: 'destructive',
      });
      setListeningField(null);
    };

    formVoiceService.start(handleResult, handleError);
  }, [setValue, triggerSubmit, toast]);

  const stopListening = useCallback(() => {
    formVoiceService.stop();
    setListeningField(null);
  }, []);

  return {
    listeningField,
    startListening,
    stopListening,
  };
}; 