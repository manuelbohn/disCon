
signRankGibbsSampler <- function(xVals, yVals = NULL, testValue = 0, nSamples = 10000, progBar = FALSE, cauchyPriorParameter = 1/sqrt(2),
                            nGibbsIterations = 5, varyTies = TRUE) {
  
  if (progBar) {
    myBar <- txtProgressBar(min = 1, max = nSamples, initial = 1, char = "*",style=3,width=50)
  }
  
  n <- length(xVals)
  nDF <- n-1

  if (!is.null(yVals)) { 
    differenceScores <- xVals - yVals
  } else {
      differenceScores <- xVals - testValue
  }
  
  differenceSigns <- (sign(differenceScores))
  absDifferenceRanked <- rank(abs(differenceScores))
  prodSignAbsRank <- differenceSigns * absDifferenceRanked
  
  initDiffSamples <- sort(abs(rnorm(n)))[absDifferenceRanked]
  sampledDiffsAbs <- abs(initDiffSamples)
  diffSamples <- numeric(n)
  
  deltaSamples <- gSamples <- numeric(nSamples)
  diffSamplesMatrix <- matrix(nrow=nSamples,ncol=n)
  
  oldDeltaProp <- 0
  
  for (j in 1:nSamples) {
    for (i in sample(n)) {
      
      currentRank <- absDifferenceRanked[i]
      
      currentBounds <- upperLowerTruncation(ranks=absDifferenceRanked, values=sampledDiffsAbs, currentRank=currentRank)
      if (is.infinite(currentBounds[["under"]])) {currentBounds[["under"]] <- 0}
      
      sampledDiffsAbs[i] <- myTruncNormSim(currentBounds[["under"]], currentBounds[["upper"]], 
                                           mu = abs(oldDeltaProp), sd=1)
    }
    
    diffSamples <- sampledDiffsAbs * differenceSigns
    
    if (any(differenceSigns == 0) && varyTies) {
      nullSamples <- sampledDiffsAbs[differenceSigns == 0] * sample(c(-1,1), size = sum(differenceSigns == 0), replace = T)
      diffSamples[which(differenceSigns == 0)] <- nullSamples
    }
    
    sampledDiffsAbs <- abs(diffSamples)
    diffSamples <- diffSamples
    
    gibbsOutput <- sampleGibbsOneSample(diffScores = diffSamples, nIter = nGibbsIterations, rscale = cauchyPriorParameter)

    deltaSamples[j] <- oldDeltaProp <- gibbsOutput[1]
    gSamples[j] <- gibbsOutput[2]

    diffSamplesMatrix[j,] <- diffSamples
    
    if(progBar)setTxtProgressBar(myBar,j) # update the progressbar
  }
  
  resultsList <- list(deltaSamples = deltaSamples, gSamples = gSamples, diffSamples = diffSamplesMatrix)
  return(resultsList)
}

sampleGibbsOneSample <- function(diffScores, nIter = 10, rscale = 1/sqrt(2)){
 
  ybar <- mean(diffScores)
  n <- length(diffScores)
  sigmaSq <- 1
  mu <- ybar
  g <- ybar^2 / sigmaSq + 1

  for(i in 1:nIter){   
    #sample mu
    varMu  = sigmaSq / (n + (1 / g))
    meanMu = (n * ybar) / (n + (1 / g))
    mu <- rnorm(1, meanMu, sqrt(varMu) )
    
    # sample g
    scaleg = (mu^2 + sigmaSq * rscale^2) / (2*sigmaSq)
    g = 1 / rgamma(1, 1, scaleg )
    
    delta <- mu / sqrt(sigmaSq)
  }
  return(c(delta, g))
}



upperLowerTruncation <- function(ranks, values, currentRank, n, ranksAreIndices = FALSE) {
  
  if (currentRank == min(ranks)) {
    under <- -Inf
  } else {
    under <- max(values[ranks < currentRank])
  }
  
  if (currentRank == max(ranks)) {
    upper <- Inf
  } else {
    upper <- min(values[ranks > currentRank])
  }
  
  return(list(under=under, upper=upper))
}

myTruncNormSim <- function(lBound = -Inf, uBound = Inf, mu = 0, sd = 1){
  
  lBoundUni <- pnorm(lBound, mean = mu, sd = sd)
  uBoundUni <- pnorm(uBound, mean = mu, sd = sd)  
  mySample <- qnorm(runif(1, lBoundUni, uBoundUni), mean = mu, sd = sd)
  
  return(mySample)
}

