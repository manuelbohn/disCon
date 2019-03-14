#isignrank.test Bayesian Wilcoxon signed rank test based on the Imprecise Dirichlet Process.
#      This is the Bayesian improved version of iwilcox.test
#
#
#   isignrank.test(x,y,"greater") performs a hypothesis test for P(Z>=-Z)>1/2 
#   with Z=Y-X and posterior probability 0.95. It returns the result of the deicison.
#   H=1 indicates that the hypothesis P(Z>=-Z)>1/2 is true with posterior
#   probability greater than 0.95, i.e., Lower_Prob>0.95. H=0 indicates
#   P(Z>=-Z)>1/2 is not true with posterior greater than 0.95, i.e.,
#   Upper_Prob<0.95. Finally, H=2 indicates an indeterminate instance, i.e.,
#   we cannot decide if  P(Z>=-Z)>1/2 is true with posterior probability
#   greater than 0.95. This means that the posterior inferences are prior
#   dependent, i.e., Lower_Prob<0.95 and  Upper_Prob>0.95.
#
#   isignrank.test(x,y,"greater") -- evaluates the hypothesis  P(Z>=-Z)>1/2. This is the
#                Bayesian improved version of wilcox.test(x,y,"greater", paired=TRUE)  (default value).
#   isignrank.test(x,y,"less") -- evaluates the hypothesis  P(Z <= -Z)>1/2. This is the
#                Bayesian improved version of wilcox.test(x,y,"less", paired=TRUE) .
#   isignrank.test(x,y,"two.sided") -- performs a two-sided Bayesian test, i.e., H=1 if 1/2 is
#                not included in the 1-ALPHA lower and upper HPD credible
#                intervals. H=0 if 1/2 is included in the 1-ALPHA lower and
#                upper HPD credible. H=2 otherwise, indeterminate case.
#                This is the Bayesian improved version of wilcox.test(x,y,'two.sided', paired=TRUE).
#
#   isignrank.test(...,alpha=value) returns the result of the hypothesis
#   test with posterior probability gretaer than 1-value.
#
#   isignrank.test(...,s=value) sets the value of the prior strength of 
#   the Dirichlet Process s to value.
#   The default value is s=(sqrt(17)-3)/2. For value=0 it coincides with the 
#   Bayesian bootstrap.
#
#   isignrank.test(...,exact=value) computes the posterior probability if value is
#   TRUE, or uses a normal approximation if value is FALSE.  If you
#   omit this argument, ISIGNRANK uses the exact method for small samples and
#   the approximate method for larger samples.
#
#   isignrank.test(...,nsamples=value) sets the number of samples generated
#   from the Dirichlet distribution to compute the posterior probabilities.
#   Default value is 200000.
#
#   isignrank.test(...,display=FALSE) does not show the plot.
#
#
#   isignrank.test(...,seed=value) specifies seed for Monte Carlo sampling.
#
#   isignrank.test(...,rope=value) introduces a (symmetric) Region of Practical
#   Equivalence (ROPE) around 1/2, i.e., [1/2-value,1/2+value].
#
#
#   isignrank.test(...) also returns the lower and upper
#   posterior credible interval at level 1-ALPHA, for the
#   lower distribution of P(Z>=-Z) and upper distribution.
#
#   Examples:
#   y <- c(0.0512,   -1.0828,   -0.4296,   -2.3370,   -0.1011  ,  0.1122 ,   0.9898  , -0.5576,   -0.8911  ,  1.8156)
#   x <- c(   0.7951 ,   0.4378   ,-0.5237   , 1.8943  ,  0.5939 ,  -0.7104  , -0.0661 ,   0.0350 ,   0.2576  ,  1.0495 )
#   isignrank.test(x,y,"greater")
# 
#   x=rnorm(10);
#   y=rnorm(10)+2;
#   isignrank.test(x,y,"greater")
#
#
#   x=rnorm(100);
#   y=rnorm(100)+0.2;
#   isignrank.test(x,y,"two.sided",alpha=0.1)
#
#
#
#   References:
#       [1] A. Benavoli, F. Mangili, F. Ruggeri and M. Zaffalon
#         "A Bayesian Wilcoxon signed-rank test based on the Dirichlet
#          process" accepted to ICML 2014
#
#  This is the R implementation of the isignrank.test and
#  is released under the Gnu Public License (GPL). 
#  It is free software and has no warranty. Read the license in COPYING.
# 
#  Copyright (c) 2014 IPG IDSIA
#  alessio@idsia.ch or benavoli@gmail.com
#  IDSIA,  Galleria 2,  6928 Manno,  Switzerland


isignrank.test <- function(x, ...) UseMethod("isignrank.test")

isignrank.test.default <-
  function(x, y , alternative = c("two.sided", "less", "greater"),
           exact = TRUE,  conf.level = 0.95, display=TRUE, nsamples=200000, s=(sqrt(17)-3)/2, rope=0, bounds=c(0.45,0.55),seed=NULL, ...)
  {
    library("gtools")
    source("../scripts/repmat.R")
    
    if (!is.null(seed))
    set.seed(seed)
    
    alternative <- match.arg(alternative)
    
    if(!is.numeric(x)) stop("'x' must be numeric")
    if(!is.numeric(y)) stop("'y' must be numeric")
    DNAME <- paste(deparse(substitute(x)), "and",
                   deparse(substitute(y)))
    x <- x[is.finite(x)]
    y <- y[is.finite(y)]
    
    alphav<-1-conf.level
    
   
    
    n.x <- as.double(length(x))
    n.y <- as.double(length(y))
    if(length(x) != length(y))
      stop("'x' and 'y' must have the same length")
  
    z=y-x
    n.z<- as.double(length(z))
    x <- matrix(-z,n.z,1)
    y <- matrix(z,1,n.z)
    X <- repmat(x,1,n.z)
    Y <- repmat(y,n.z,1)
    Al <- (sign(Y-X)+1)/2        

    if ((n.z)>250)
{
  exact <- FALSE
  warning("'Data Size is too large. METHOD is set to approximate")
}
    
    

    if(exact==TRUE)
    {
      data1 <- rdirichlet(nsamples,cbind(matrix(1,1,n.z),s))

      
      #Compute the lower posterior distribution of the hypothesis
      data12l <- (data1[,1:n.z]%*%Al)*data1[,1:n.z]
      data12l <- apply(data12l,1,sum)

      #Compute the upper posterior distribution of the hypothesis
      data12u <- data12l+(data1[,n.z+1])*(2-data1[,n.z+1])


    }
    else        
    {

      
      #Use Normal approximation
    
      #compute variance
      CovW <- (matrix(1,n.z,n.z)+ diag(1,n.z)) /((s + n.z)*(s + n.z + 1))
      
      #For the lower
      #compute mean
      meanl <-sum(diag(Al%*%CovW))
      
      
      #compute variance
      den= (s + n.z + 3)*(s + n.z + 2)*(s + n.z + 1)*(s + n.z)
      mu0=1/den
      mu1=2/den
      mu2=4/den
      mu3=6/den
      mu4=24/den
      a=diag(Al)
      As=(Al+Al)/2
      a4=t(a)%*%a
      a2=2*sum(diag(As%*%As))+sum(diag(As))^2-3*t(a)%*%a
      a3=4*sum(diag(diag(a)%*%(As-diag(a))%*%matrix(1,n.z,n.z)))      
      a1a=2*(sum(diag(diag(a)%*%matrix(1,n.z,n.z)%*%As%*%matrix(1,n.z,n.z)))-2*sum(diag(diag(a)%*%(As)%*%matrix(1,n.z,n.z)))+t(a)%*%a)-sum(diag(diag(a)%*%(t(diag(a)%*%matrix(1,n.z,n.z))-diag(a))%*%matrix(1,n.z,n.z)))-(sum(diag(As)^2)-t(a)%*%a)
  
      
      
      a1b=4*sum(diag((As-diag(a))%*%(As-diag(a))%*%matrix(1,n.z,n.z)))-2*(2*sum(diag(As%*%As))-2*t(a)%*%a)
       a1=(a1a+a1b)
       a0=(sum(diag(As%*%matrix(1,n.z,n.z)%*%As%*%matrix(1,n.z,n.z)))-a1-a2-a3-a4)
      Varl=mu4*a4+mu3*a3+mu2*a2+mu1*a1+mu0*a0-meanl^2

     #For the Upper
     #compute mean
     meanu=meanl+(s^2 +2*s*n.z+s)/((s+n.z)*(s+n.z+1))

    #compute variance
    Q= (matrix(1,n.z,n.z) + diag(1,n.z))*s*(5+2*n.z+s)/((n.z+s)*(1+n.z+s)*(2+n.z+s)*(3+n.z+s))
    Varu=Varl+2*n.z*(1+n.z)*s*(3+6*n.z+2*n.z^2 +3*s+2*n.z*s)/((n.z+s)^2*(1+n.z+s)^2*(2+n.z+s)*(3+n.z+s))+2*sum(diag(Al%*%Q))-2*meanl*(s^2 +2*s*n.z+s)/((s+n.z)*(s+n.z+1))

      
      data12l <- rnorm(nsamples,meanl,sqrt(Varl))
      data12u <-  rnorm(nsamples,meanu,sqrt(Varu))
    }
    

    
    
    #compute credible interval for the lower
    SD <- sort(data12l);
    xll = SD[ceiling(alphav*nsamples/2)] #left bound
    xlr = SD[ceiling((1-alphav/2)*nsamples)] #right bound
    
    #compute credible interval for the upper
    SD = sort(data12u);
    xul = SD[ceiling(alphav*nsamples/2)] #left bound
    xur = SD[ceiling((1-alphav/2)*nsamples)] #right bound
    
    cred_Lower_bound<-c(xll,xlr)
    cred_Upper_bound<-c(xul,xur)
    
   
    
    switch(alternative,
           "two.sided" = {
             if((xlr<0.5-rope && xur<0.5-rope) || (xll>0.5+rope && xul>0.5+rope)){
               h <- 1; #hypotheis H1 is accepted
             }else{
               if((xll<0.5-rope && xlr>=0.5+rope) && (xul<0.5-rope && xur>=0.5+rope)) 
                 h <- 0 #hypotheis H0 is accepted
               else
                 h <- 2 #no enough information to discrimnate hypotheses H0  and H1
             }
             prob <-NULL
             },
           "greater" = {
             areal <- length(which(data12l>0.5+rope))/nsamples;
             areau <- length(which(data12u>0.5+rope))/nsamples;
             #              
             if (areal>1-alphav && areau>1-alphav){
               h<-1 #hypotheis H1 is accepted
             } else {
               if((areal<=1-alphav && areau>1-alphav) ||  (areal>1-alphav && areau<=1-alphav))
                 h<-2 #no enough information to discriminate hypotheses H0  and H1
               else
                 h<-0  #hypotheis H0 is accepted
             }
             prob<-c(areal,areau)
           },
           "less" = {
             areal <- length(which(1-data12l>0.5+rope))/nsamples;
             areau <- length(which(1-data12u>0.5+rope))/nsamples;
             #              
             if (areal>1-alphav && areau>1-alphav){
               h<-1 #hypotheis H1 is accepted
             } else {
               if((areal<=1-alphav && areau>1-alphav) ||  (areal>1-alphav && areau<=1-alphav))
                 h<-2 #no enough information to discriminate hypotheses H0  and H1
               else
                 h<-0  #hypotheis H0 is accepted
             }
             prob<-c(areal,areau)
           })

    if (display==TRUE)
    {
      plot.new()    
      ## calculate the density - don't plot yet
      densLower <- density(data12l)
      densUpper <- density(data12u)
      ## calculate the range of the graph
      xlim <- c(0,1)
      ylim <- range(0,densUpper$y, densLower$y)
      #pick the colours
      LowerCol <- rgb(1,0,0,0.2)
      UpperCol <- rgb(0,0,1,0.2)
      LowInt<- rgb(1,0,0,0.8)
      UpInt <- rgb(0,0,1,0.8)
      
 
      
      if (alternative=="greater")
{    ## plot the Lowers and set up most of the plot parameters
    plot(densLower, xlim = xlim, ylim = ylim, xlab = 'P(Z>=-Z)', ylab='Probability', main='IDP isignrank',
         panel.first = grid(),col=LowInt, axes=FALSE)
    xlabel  <- seq(0, 1, by = 0.1)
    axis(1, at = xlabel, las = 1)
    axis(2)
    box()
    lines(densUpper, xlim = xlim, ylim = ylim, xlab = 'P(Z>=-Z)', ylab='Probability', main='IDP isignrank',
         panel.first = grid(),col=UpInt)
    #put our density plots in
    dens<- densLower
    polygon(c(0.5, dens$x[dens$x>.5 & dens$x <= 1], xlim[2]), c(0, dens$y[dens$x>=.5 & dens$x <= 1], 0),density = -1, col = LowerCol)
    dens<- densUpper
    polygon(c(0.5, dens$x[dens$x>.5 & dens$x <= 1], xlim[2]), c(0, dens$y[dens$x>=.5 & dens$x <= 1], 0),density = -1, col = UpperCol)
    ## add a legend in the corner
    legend('topleft',c('Lower Distribution','Upper Distribution'),
           fill = c(LowerCol, UpperCol), bty = 'n',
           border = NA)
    #       get( getOption( "device" ) )()
    usr <- par( "usr" )
    text( usr[ 1 ], usr[ 4 ], paste("Area Lower=",areal),    adj = c( 0, 1 ), col = LowInt )
    text( usr[ 2 ], usr[ 4 ], paste("Area Upper=",areau),    adj = c( 1, 1 ), col = UpInt )

    }
      if (alternative=="less")
      {    ## plot the Lowers and set up most of the plot parameters
        plot(densLower, xlim = xlim, ylim = ylim, xlab = 'P(Z<=-Z)', ylab='Probability', main='IDP isignrank',
             panel.first = grid(),col=LowInt, axes=FALSE)
        xlabel  <- seq(0, 1, by = 0.1)
        axis(1, at = xlabel, las = 1)
        axis(2)
        box()
        lines(densUpper, xlim = xlim, ylim = ylim, xlab = 'P(Z<=-Z)', ylab='Probability', main='IDP isignrank',
              panel.first = grid(),col=UpInt)
        #put our density plots in
        dens<- densLower
        polygon(c(xlim[1], dens$x[dens$x>.0 & dens$x <= 0.5], 0.5), c(0, dens$y[dens$x>=.0 & dens$x <= 0.5], 0),density = -1, col = UpperCol)
        dens<- densUpper
        polygon(c(xlim[1], dens$x[dens$x>.0 & dens$x <= 0.5], 0.5), c(0, dens$y[dens$x>=.0 & dens$x <= 0.5], 0),density = -1, col = LowerCol)
        ## add a legend in the corner
        legend('topleft',c('Lower Distribution','Upper Distribution'),
               fill = c(LowerCol, UpperCol), bty = 'n',
               border = NA)
        #       get( getOption( "device" ) )()
        usr <- par( "usr" )
        text( usr[ 1 ], usr[ 4 ], paste("Area Upper=",areal),    adj = c( 0, 1 ), col = UpInt )
        text( usr[ 2 ], usr[ 4 ], paste("Area Lower=",areau),    adj = c( 1, 1 ), col = LowInt )
      }
      
      if (alternative=="two.sided")
      {    ## plot the Lowers and set up most of the plot parameters
        plot(densLower, xlim = xlim, ylim = ylim, xlab = 'P(Z>=-Z)', ylab='Probability', main='IDP isignrank',
             panel.first = grid(),col=LowInt, axes=FALSE)
        xlabel  <- seq(0, 1, by = 0.1)
         axis(1, at = xlabel, las = 1)
         axis(2)
         box()
        lines(densUpper, xlim = xlim, ylim = ylim, xlab = 'P(Z>=-Z)', ylab='Probability', main='IDP isignrank',
              panel.first = grid(),col=UpInt)
        #put our density plots in
        dens<- densLower
        polygon(c(xll, dens$x[dens$x>xll & dens$x <= xlr], xlr), c(0, dens$y[dens$x>=xll & dens$x <= xlr], 0),density = -1, col = LowerCol)
        dens<- densUpper
        polygon(c(xul, dens$x[dens$x>xul & dens$x <= xur], xur), c(0, dens$y[dens$x>=xul & dens$x <= xur], 0),density = -1, col = UpperCol)
        ## add a legend in the corner
        legend('topleft',c('Lower Distribution','Upper Distribution'),
               fill = c(LowerCol, UpperCol), bty = 'n',
               border = NA)
        #       get( getOption( "device" ) )()
        usr <- par( "usr" )
        xll<- round(xll*100)/100
        xul<- round(xul*100)/100
        xlr<- round(xlr*100)/100
        xur<- round(xur*100)/100
        text( usr[ 1 ], usr[ 4 ], paste("Cred Lower Int=[",xll,",",xlr,"]"),    adj = c( 0, 1 ), col = LowInt )
        text( usr[ 2 ], usr[ 4 ], paste("Cred Upper Int=[",xul,",",xur,"]"),    adj = c( 1, 1 ), col = UpInt )
      }


      
    }
    est<-list("h"=h,"prob"=prob,"Lower_Cred_Int"=cred_Lower_bound,"Upper_Cred_Int"=cred_Upper_bound,"alternative"=alternative )
    class(est) <- "isignrank"
    est
    
    
  }

print.isignrank <- function(x, ...)
{
  x$Lower_Cred_Int[1]<- round(x$Lower_Cred_Int[1]*1000)/1000
  x$Lower_Cred_Int[2]<- round(x$Lower_Cred_Int[2]*1000)/1000
  x$Upper_Cred_Int[1]<- round(x$Upper_Cred_Int[1]*1000)/1000
  x$Upper_Cred_Int[2]<- round(x$Upper_Cred_Int[2]*1000)/1000
  h<-x$h
  cat("Result of the IDP ISIGNRANK hypothesis test\n")
  cat(paste("h=",h)) 
  cat("\n")
  if (x$h==2)
    cat("Indeterminate\n")
  if (x$h==1)
    cat("Y is better than X\n")
  if (x$h==0)
    cat("Y is not better than X\n")
  if (!is.null(x$prob)){
    if (x$alternative=="greater"){
  cat("\nLower Probability of the hypothesis:\n")
  cat(x$prob[1])
  cat("\nUpper Probability of the hypothesis:\n")
  cat(x$prob[2])}
    if (x$alternative=="less"){
      cat("\nLower Probability of the hypothesis:\n")
      cat(x$prob[2])
      cat("\nUpper Probability of the hypothesis:\n")
      cat(x$prob[1])}
  cat("\n")}
  cat("\nLower Central credible intervals\n")
  cat(paste("[",x$Lower_Cred_Int[1],",",x$Lower_Cred_Int[2],"]"))
  cat("\nUpper Central credible intervals\n")
  cat(paste("[",x$Upper_Cred_Int[1],",",x$Upper_Cred_Int[2],"]"))
}




isignrank.test.formula <-
  function(formula, data, subset, na.action, ...)
  {
    if(missing(formula)
       || (length(formula) != 3L)
       || (length(attr(terms(formula[-2L]), "term.labels")) != 1L))
      stop("'formula' missing or incorrect")
    m <- match.call(expand.dots = FALSE)
    if(is.matrix(eval(m$data, parent.frame())))
      m$data <- as.data.frame(data)
    m[[1L]] <- quote(stats::model.frame)
    m$... <- NULL
    mf <- eval(m, parent.frame())
    DNAME <- paste(names(mf), collapse = " by ")
    names(mf) <- NULL
    response <- attr(attr(mf, "terms"), "response")
    g <- factor(mf[[-response]])
    if(nlevels(g) != 2L)
      stop("grouping factor must have exactly 2 levels")
    DATA <- setNames(split(mf[[response]], g),
                     c("x", "y"))
    y <- do.call("isignrank.test", c(DATA, list(...)))
    y$data.name <- DNAME
    y
  }

