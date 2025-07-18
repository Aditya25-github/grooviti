import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./votingZone.css";

const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

const DUMMY_CANDIDATES = [
  {
    id: "1",
    name: "John Doe",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    gender: GENDER.MALE,
    department: "Computer Science",
  },
  {
    id: "2",
    name: "Alex Roy",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    gender: GENDER.MALE,
    department: "Electrical Engineering",
  },
  {
    id: "3",
    name: "Jane Smith",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
    gender: GENDER.FEMALE,
    department: "Mechanical Engineering",
  },
  {
    id: "4",
    name: "Emily Rose",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80",
    gender: GENDER.FEMALE,
    department: "Civil Engineering",
  },
];

const VotingZone = () => {
  const [selectedGender, setSelectedGender] = useState(GENDER.MALE);
  const [candidates, setCandidates] = useState([]);
  const [votedMaleId, setVotedMaleId] = useState(null);
  const [votedFemaleId, setVotedFemaleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setCandidates(DUMMY_CANDIDATES);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleVote = useCallback(
    (candidate) => {
      if (candidate.gender === GENDER.MALE && votedMaleId) return;
      if (candidate.gender === GENDER.FEMALE && votedFemaleId) return;
      if (candidate.gender === GENDER.MALE) setVotedMaleId(candidate.id);
      else setVotedFemaleId(candidate.id);
      toast.success(`Thank you! Your vote for ${candidate.name} is counted.`);
    },
    [votedMaleId, votedFemaleId]
  );

  // Filter candidates based on selected gender
  let filteredCandidates = candidates.filter(
    (c) => c.gender === selectedGender
  );
  // Move the voted candidate card to the top if exists
  const genderVoteId =
    selectedGender === GENDER.MALE ? votedMaleId : votedFemaleId;
  if (genderVoteId) {
    filteredCandidates = [
      ...filteredCandidates.filter((c) => c.id === genderVoteId),
      ...filteredCandidates.filter((c) => c.id !== genderVoteId),
    ];
  }

  const voteUsedForGender = !!genderVoteId;
  const allVotesCast = votedMaleId && votedFemaleId;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />

      <nav className="gender-switch" aria-label="Select Gender Group">
        <button
          className={`gender-button${
            selectedGender === GENDER.MALE ? " selected" : ""
          }`}
          onClick={() => setSelectedGender(GENDER.MALE)}
          aria-pressed={selectedGender === GENDER.MALE}
        >
          Male
        </button>
        <button
          className={`gender-button${
            selectedGender === GENDER.FEMALE ? " selected" : ""
          }`}
          onClick={() => setSelectedGender(GENDER.FEMALE)}
          aria-pressed={selectedGender === GENDER.FEMALE}
        >
          Female
        </button>
      </nav>

      {isLoading ? (
        <div className="loading-spinner" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading candidates...</p>
        </div>
      ) : (
        <section
          className="candidates-grid"
          aria-label={`${selectedGender} candidates`}
        >
          {filteredCandidates.map((candidate) => {
            const isVotedCandidate = genderVoteId === candidate.id;
            // After voting, only voted card is interactive for that group
            const isCardDisabled = voteUsedForGender && !isVotedCandidate;
            return (
              <article
                key={candidate.id}
                className={
                  `candidate-card` +
                  (isVotedCandidate ? " card-voted" : "") +
                  (isCardDisabled ? " card-nonclickable" : "")
                }
                aria-label={`Candidate: ${candidate.name}, Department: ${candidate.department}`}
                tabIndex={isCardDisabled ? -1 : 0}
              >
                <div className="image-container">
                  <img
                    src={candidate.image}
                    alt={`Photo of ${candidate.name}`}
                    className="candidate-image"
                    loading="lazy"
                    style={{ cursor: "default" }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/220x160?text=No+Image";
                    }}
                  />
                  {isVotedCandidate && (
                    <div
                      className="voted-badge"
                      aria-label="You voted for this candidate"
                    >
                      Voted
                    </div>
                  )}
                </div>
                <div className="candidate-info">
                  <h3 className="candidate-name">{candidate.name}</h3>
                  <p className="candidate-department">{candidate.department}</p>
                  {!isCardDisabled ? (
                    <button
                      className={`vote-button${
                        isVotedCandidate ? " voted" : ""
                      }`}
                      onClick={() => handleVote(candidate)}
                      disabled={isVotedCandidate}
                      aria-label={
                        isVotedCandidate
                          ? `Already voted for ${candidate.name}`
                          : `Vote for ${candidate.name}`
                      }
                    >
                      {isVotedCandidate ? "Voted" : "Vote Now"}
                    </button>
                  ) : (
                    <button className="vote-button" disabled tabIndex={-1}>
                      Vote Now
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
};

export default VotingZone;
