'use client';

import { useState, useEffect, useRef } from 'react';

// Types
interface TestData {
  fullName: string;
  email: string;
  whatsapp: string;
  wpm: number;
  accuracy: number;
  situationalAnswers: string[];
  reflectionAnswers: string[];
  totalTestTime: string;
}

interface TypingResult {
  wpm: number;
  accuracy: number;
}

export default function ChatterTest() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [testData, setTestData] = useState<TestData>({
    fullName: '',
    email: '',
    whatsapp: '',
    wpm: 0,
    accuracy: 0,
    situationalAnswers: ['', '', '', '', ''],
    reflectionAnswers: ['', '', ''],
    totalTestTime: ''
  });

  // Typing test states
  const [timeLeft, setTimeLeft] = useState(60);
  const [testStarted, setTestStarted] = useState(false);
  const [typingResult, setTypingResult] = useState<TypingResult>({ wpm: 0, accuracy: 0 });
  const [typedText, setTypedText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingInputRef = useRef<HTMLTextAreaElement>(null);

  const typingPhrase = "Le soleil brille haut dans le ciel bleu, projetant une lumière dorée sur les champs de blé qui ondulent doucement sous la brise estivale. Les oiseaux chantent joyeusement dans les arbres, leurs mélodies se mêlant au bourdonnement des abeilles qui butinent les fleurs sauvages. C'est une journée parfaite pour une promenade.";

  const steps = [
    'intro',
    'personal-info', 
    'writing-speed',
    'situational',
    'reflection',
    'results'
  ];

  const situationalQuestions = [
    {
      title: "Scénario 1 : Demande de Contenu Explicite Inappropriée",
      prompt: "Le fan écrit : \"Salut, envoie une photo de ton vagin tout de suite. Je paie bien.\"",
      instruction: "Explique comment tu gérerais cette demande. Quelle serait ta stratégie pour refuser poliment tout en redirigeant le fan vers une interaction appropriée ?",
      placeholder: "Ta réponse : (Comment refuser poliment et rediriger ?)"
    },
    {
      title: "Scénario 2 : Doute sur l'Authenticité de la Modèle",
      prompt: "Le fan écrit : \"C'est pas vrai, tu n'es pas réelle. C'est un mec qui répond à ta place, c'est sûr.\"",
      instruction: "Comment prouverais-tu l'authenticité de la modèle de manière créative et professionnelle, sans divulguer d'informations personnelles ?",
      placeholder: "Ta réponse : (Comment le convaincre que c'est bien la modèle qui parle ?)"
    },
    {
      title: "Scénario 3 : Négociation de Prix",
      prompt: "Contexte : Tu as proposé une vidéo exclusive à 35€. Le fan écrit : \"Hmm, 35€ c'est un peu cher... Je sais pas trop.\"",
      instruction: "Explique comment tu justifierais la valeur du contenu sans baisser le prix. Quelles émotions ou bénéfices mettrais-tu en avant ?",
      placeholder: "Ta réponse : (Comment justifier la valeur sans baisser le prix ?)"
    },
    {
      title: "Scénario 4 : Demande de Contenu Gratuit",
      prompt: "Le fan écrit : \"J'ai plus d'argent ce mois-ci, mais j'ai trop envie de te voir. Tu peux m'en envoyer un petit truc gratuit pour me faire patienter ?\"",
      instruction: "Comment gérerais-tu cette demande pour maintenir la relation et l'intérêt du fan, sans dévaloriser le contenu payant ?",
      placeholder: "Ta réponse : (Comment maintenir la relation sans donner de contenu gratuit ?)"
    },
    {
      title: "Scénario 5 : Tentative de Changement de Plateforme",
      prompt: "Le fan écrit : \"J'adore te parler ! On peut continuer sur Snap ou Insta ? C'est plus simple.\"",
      instruction: "Explique comment tu convaincrais le fan de rester sur OnlyFans. Quels arguments utiliserais-tu pour souligner les avantages de la plateforme ?",
      placeholder: "Ta réponse : (Comment le garder sur OnlyFans ?)"
    }
  ];

  const reflectionQuestions = [
    "Selon toi, quel est l'équilibre idéal entre \"construire une relation\" et \"vendre du contenu\" ?",
    "Comment gérerais-tu un \"gros dépensier\" (un fan qui achète beaucoup) pour qu'il reste fidèle sur le long terme ?",
    "Pourquoi est-il crucial de poser des questions aux fans et de les écouter attentivement ?"
  ];

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Typing test functions
  const startTimer = () => {
    setTestStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          calculateTypingResults();
          if (typingInputRef.current) {
            typingInputRef.current.disabled = true;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTypingInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTypedText(value);

    if (!testStarted && value.length > 0) {
      startTimer();
    }

    if (timeLeft <= 0) return;
  };

  const calculateTypingResults = () => {
    const words = typedText.split(/\s+/).filter(word => word.length > 0);
    const wpm = Math.round((words.length / 60) * 60);
    
    let correctChars = 0;
    for (let i = 0; i < Math.min(typedText.length, typingPhrase.length); i++) {
      if (typedText[i] === typingPhrase[i]) {
        correctChars++;
      }
    }
    
    const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 0;
    
    const result = { wpm, accuracy };
    setTypingResult(result);
    setTestData(prev => ({ ...prev, wpm, accuracy }));
  };

  const renderTypingText = () => {
    return typingPhrase.split('').map((char, index) => {
      let className = '';
      
      if (index < typedText.length) {
        if (typedText[index] === char) {
          className = 'correct-char';
        } else {
          className = 'incorrect-char';
        }
      } else if (index === typedText.length) {
        className = 'active-char';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      
      // Initialize typing test when entering that step
      if (steps[currentStepIndex + 1] === 'writing-speed') {
        setTimeLeft(60);
        setTestStarted(false);
        setTypedText('');
        if (typingInputRef.current) {
          typingInputRef.current.disabled = false;
          typingInputRef.current.value = '';
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      
      // Clear typing test timer if going back
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const showResults = () => {
    // Stop timer if still running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate final typing results if not done
    if (timeLeft > 0 && typingInputRef.current) {
      typingInputRef.current.disabled = true;
      calculateTypingResults();
    }
    
    setCurrentStepIndex(steps.length - 1);
  };

  const updatePersonalInfo = (field: keyof TestData, value: string) => {
    setTestData(prev => ({ ...prev, [field]: value }));
  };

  const updateSituationalAnswer = (index: number, value: string) => {
    setTestData(prev => {
      const newAnswers = [...prev.situationalAnswers];
      newAnswers[index] = value;
      return { ...prev, situationalAnswers: newAnswers };
    });
  };

  const updateReflectionAnswer = (index: number, value: string) => {
    setTestData(prev => {
      const newAnswers = [...prev.reflectionAnswers];
      newAnswers[index] = value;
      return { ...prev, reflectionAnswers: newAnswers };
    });
  };

  const sendEmail = () => {
    const recipientEmail = "evan.gssln@gmail.com";
    let emailBody = `Résultats du Test de Sélection Chatter OnlyFans\n\n`;
    emailBody += `Informations Personnelles:\n`;
    emailBody += `Nom & Prénom: ${testData.fullName || 'Non renseigné'}\n`;
    emailBody += `Adresse E-mail du Candidat: ${testData.email || 'Non renseigné'}\n`;
    emailBody += `Numéro WhatsApp: ${testData.whatsapp || 'Non renseigné'}\n\n`;

    emailBody += `Partie 2 : Vitesse d'Écriture:\n`;
    emailBody += `Mots par minute (MPM): ${testData.wpm} MPM\n`;
    emailBody += `Précision: ${testData.accuracy}%\n\n`;

    emailBody += `Partie 3 : Mises en Situation:\n`;
    situationalQuestions.forEach((q, index) => {
      emailBody += `${q.title}:\n"${testData.situationalAnswers[index] || 'Non répondu'}"\n\n`;
    });

    emailBody += `Partie 4 : Réflexion & Stratégie:\n`;
    reflectionQuestions.forEach((q, index) => {
      emailBody += `${index + 1}. ${q}:\n"${testData.reflectionAnswers[index] || 'Non répondu'}"\n\n`;
    });

    emailBody += `Temps Total du Test: ${testData.totalTestTime || 'Non renseigné'}\n\n`;
    emailBody += `Ce test a été complété via l'application de sélection des chatters.`;

    const subject = encodeURIComponent("Résultats du Test de Sélection Chatter - " + (testData.fullName || 'Candidat'));
    const body = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoLink;
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          setModalContent(emailBody);
          setIsModalOpen(true);
        }
      }, 1000);
    } catch (e) {
      setModalContent(emailBody);
      setIsModalOpen(true);
    }
  };

  const copyResults = () => {
    navigator.clipboard.writeText(modalContent).then(() => {
      alert('Résultats copiés dans le presse-papier !');
    });
  };

  const getProgressPercentage = () => {
    if (currentStepIndex <= 1) return 0;
    return ((currentStepIndex - 1) / 4) * 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="container mx-auto max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300">
          
          {/* Progress Bar */}
          {currentStepIndex > 0 && currentStepIndex < steps.length - 1 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`step-indicator flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step < currentStepIndex 
                        ? 'completed' 
                        : step === currentStepIndex 
                        ? 'active' 
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="w-full h-1 bg-gray-200 rounded-full">
                <div 
                  className="bg-teal-600 h-1 rounded-full progress-bar-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}

          {/* Step Content */}
          {currentStepIndex === 0 && (
            <div className="step-content">
              <h1 className="text-3xl font-bold text-center text-emerald-700 mb-2">
                Test de Sélection pour Chatter OnlyFans
              </h1>
              <p className="text-center text-gray-500 mb-6">Évaluez vos compétences clés pour le succès</p>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Bienvenue, futur(e) Chatter !</h2>
                <p className="mb-4 text-gray-600">
                  Ce test est conçu pour évaluer tes compétences essentielles pour exceller en tant que chatter : 
                  ta rapidité d'écriture, ta logique de réponse et ta compréhension des dynamiques sur OnlyFans.
                </p>
                
                <h3 className="font-semibold text-gray-700 mb-2">Déroulé du test :</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>1. Tes Informations</strong> - Nom, prénom, adresse e-mail.</li>
                  <li><strong>2. Vitesse d'Écriture</strong> - Tu devras taper une phrase dans un temps imparti. Un minuteur sera visible. L'objectif est d'atteindre 30 mots par minute (MPM) avec une bonne précision.</li>
                  <li><strong>3. Logique de Réponse</strong> - Des mises en situation concrètes sur OnlyFans, où tu devras rédiger la meilleure réponse possible.</li>
                  <li><strong>4. Réflexion & Stratégie</strong> - Des questions ouvertes pour évaluer ta compréhension des enjeux du chatting.</li>
                  <li><strong>Résultats Finaux</strong> - À la fin, un récapitulatif de tes performances s'affichera.</li>
                </ul>
                
                <p className="mt-4 text-gray-600 font-semibold">Lis attentivement chaque section. Bonne chance !</p>
                <p className="mt-6 p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                  <strong>Important :</strong> Veuillez réaliser ce test sur un <strong>ordinateur</strong> pour une expérience optimale, notamment pour le test de vitesse d'écriture.
                </p>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setCurrentStepIndex(1)}
                  className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-md"
                >
                  Démarrer le Test
                </button>
              </div>
            </div>
          )}

          {currentStepIndex === 1 && (
            <div className="step-content">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700">Partie 1 : Tes Informations</h2>
              <p className="text-gray-500 mb-6">
                Veuillez remplir ces informations pour que nous puissions te recontacter si ton test nous convient.
              </p>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nom & Prénom :</label>
                  <input
                    type="text"
                    value={testData.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Adresse E-mail :</label>
                  <input
                    type="email"
                    value={testData.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: ton.email@exemple.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Numéro WhatsApp (optionnel) :</label>
                  <input
                    type="tel"
                    value={testData.whatsapp}
                    onChange={(e) => updatePersonalInfo('whatsapp', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: +33612345678"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStepIndex === 2 && (
            <div className="step-content">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700">Partie 2 : Vitesse d'Écriture & Fluidité</h2>
              <p className="text-gray-500 mb-6">
                Consigne : Tape le texte ci-dessous le plus rapidement et précisément possible pendant 1 minute. 
                Le minuteur démarrera dès que tu commences à taper. L'objectif est d'atteindre 30 mots par minute (MPM) avec une bonne précision.
              </p>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6">
                <p className="font-semibold text-gray-700 mb-2">
                  Temps restant : <span className="text-emerald-600 font-bold">{timeLeft}</span> secondes
                </p>
                
                <div className="typing-text-container mb-4">
                  {renderTypingText()}
                </div>
                
                <textarea
                  ref={typingInputRef}
                  value={typedText}
                  onChange={handleTypingInput}
                  className="w-full p-3 border border-stone-300 rounded-lg h-40 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-lg leading-7"
                  placeholder="Commence à taper ici..."
                  disabled={timeLeft === 0}
                />
                
                {timeLeft === 0 && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-semibold text-emerald-700">Résultats :</p>
                    <p>Mots par minute : <span className="font-bold text-emerald-600">{typingResult.wpm} MPM</span></p>
                    <p>Précision : <span className="font-bold text-emerald-600">{typingResult.accuracy}%</span></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStepIndex === 3 && (
            <div className="step-content">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700">Partie 3 : Mises en Situation (Logique de Réponse)</h2>
              <p className="text-gray-500 mb-6">
                Consigne : Rédige la réponse exacte que tu enverrais au fan dans chaque situation. 
                Pense au ton (amical, professionnel, engageant) et à l'utilisation appropriée des emojis.
              </p>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-6">
                {situationalQuestions.map((question, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-700 mb-2">{question.title}</p>
                    <p className="text-gray-600 mb-2">{question.prompt}</p>
                    <p className="text-gray-600 mb-2 text-sm italic">Quoi faire : {question.instruction}</p>
                    <textarea
                      value={testData.situationalAnswers[index]}
                      onChange={(e) => updateSituationalAnswer(index, e.target.value)}
                      className="w-full p-3 border border-stone-300 rounded-lg h-28 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      placeholder={question.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepIndex === 4 && (
            <div className="step-content">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700">Partie 4 : Réflexion & Stratégie</h2>
              <p className="text-gray-500 mb-6">
                Consigne : Réponds brièvement à ces questions en te basant sur ta logique et ton expérience. 
                Il n'y a pas de réponse unique, mais nous cherchons à comprendre ta manière de penser.
              </p>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-6">
                {reflectionQuestions.map((question, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-700 mb-2">{index + 1}. {question}</p>
                    <textarea
                      value={testData.reflectionAnswers[index]}
                      onChange={(e) => updateReflectionAnswer(index, e.target.value)}
                      className="w-full p-3 border border-stone-300 rounded-lg h-28 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      placeholder="Ta réponse..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepIndex === 5 && (
            <div className="step-content">
              <h2 className="text-2xl font-bold text-center mb-4 text-emerald-700">Tes Résultats du Test</h2>
              
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 text-gray-700 space-y-4">
                <div>
                  <p className="text-lg font-semibold">Tes Informations :</p>
                  <p>Nom & Prénom : <span className="font-bold text-gray-800">{testData.fullName || 'Non renseigné'}</span></p>
                  <p>Adresse E-mail : <span className="font-bold text-gray-800">{testData.email || 'Non renseigné'}</span></p>
                  <p>Numéro WhatsApp : <span className="font-bold text-gray-800">{testData.whatsapp || 'Non renseigné'}</span></p>
                </div>

                <div>
                  <p className="text-lg font-semibold mt-6">Partie 2 : Vitesse d'Écriture :</p>
                  <p>Mots par minute (MPM) : <span className="font-bold text-emerald-600">{testData.wpm} MPM</span></p>
                  <p>Précision : <span className="font-bold text-emerald-600">{testData.accuracy}%</span></p>
                </div>

                <div>
                  <p className="text-lg font-semibold mt-6">Partie 3 : Mises en Situation (Tes Réponses) :</p>
                  <div className="space-y-4 text-sm">
                    {situationalQuestions.map((question, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium text-gray-600">{question.title}</p>
                        <p className="text-gray-800 italic ml-4">
                          Ta réponse : "{testData.situationalAnswers[index] || 'Non répondu'}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-lg font-semibold mt-6">Partie 4 : Réflexion & Stratégie (Tes Réponses) :</p>
                  <div className="space-y-4 text-sm">
                    {reflectionQuestions.map((question, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium text-gray-600">{index + 1}. {question}</p>
                        <p className="text-gray-800 italic ml-4">
                          Ta réponse : "{testData.reflectionAnswers[index] || 'Non répondu'}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-lg font-semibold mt-6">Temps Total du Test (à renseigner manuellement) :</p>
                  <input
                    type="text"
                    value={testData.totalTestTime}
                    onChange={(e) => updatePersonalInfo('totalTestTime', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder="Ex: 30 minutes"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Veuillez indiquer le temps total que vous avez mis pour compléter l'ensemble du test.
                  </p>
                </div>
              </div>

              <p className="text-center text-gray-600 mt-6">
                <strong>Important :</strong> Veuillez copier l'intégralité de cette page (ou faire une capture d'écran) 
                et l'envoyer par e-mail à la personne qui vous a fourni ce test. 
                Nous vous recontacterons si votre profil correspond à nos attentes !
              </p>

              <div className="mt-8 text-center">
                <button
                  onClick={sendEmail}
                  className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-md"
                >
                  Envoyer les résultats par e-mail
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStepIndex > 0 && currentStepIndex < steps.length - 1 && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className={`bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors duration-300 ${
                  currentStepIndex === 0 ? 'hidden' : ''
                }`}
              >
                Précédent
              </button>
              
              {currentStepIndex === steps.length - 2 ? (
                <button
                  onClick={showResults}
                  className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300 ml-auto"
                >
                  Afficher les résultats
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300 ml-auto"
                >
                  Suivant
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal for Email Fallback */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-700">Problème d'envoi d'e-mail</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <p className="mb-4 text-gray-700">
              Il semble que votre client de messagerie n'ait pas pu s'ouvrir automatiquement.
            </p>
            <p className="mb-4 text-gray-700">
              Veuillez copier les résultats ci-dessous et les coller manuellement dans un nouvel e-mail à{' '}
              <strong className="text-emerald-600">evan.gssln@gmail.com</strong>.
            </p>
            
            <textarea
              value={modalContent}
              readOnly
              className="w-full p-3 border border-stone-300 rounded-lg h-40 mb-4"
            />
            
            <button
              onClick={copyResults}
              className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
            >
              Copier les résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}