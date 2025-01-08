-- CreateTable
CREATE TABLE "shortlisted_movies" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT NOT NULL,
    "voteAverage" DOUBLE PRECISION NOT NULL,
    "providers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "shortlisted_movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shortlisted_movies_sessionId_idx" ON "shortlisted_movies"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "shortlisted_movies_movieId_sessionId_key" ON "shortlisted_movies"("movieId", "sessionId");
