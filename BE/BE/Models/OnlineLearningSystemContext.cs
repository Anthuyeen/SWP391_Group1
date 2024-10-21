using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BE.Models;

public partial class OnlineLearningSystemContext : DbContext
{
    public OnlineLearningSystemContext()
    {
    }

    public OnlineLearningSystemContext(DbContextOptions<OnlineLearningSystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AnswerOption> AnswerOptions { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Dimension> Dimensions { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<LessonCompletion> LessonCompletions { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<PostContent> PostContents { get; set; }

    public virtual DbSet<PostImage> PostImages { get; set; }

    public virtual DbSet<PricePackage> PricePackages { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<QuizAttempt> QuizAttempts { get; set; }

    public virtual DbSet<Registration> Registrations { get; set; }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAnswer> UserAnswers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AnswerOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ANSWER_O__3213E83F1B9C8637");

            entity.ToTable("ANSWER_OPTION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.IsCorrect).HasColumnName("is_correct");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(d => d.Question).WithMany(p => p.AnswerOptions)
                .HasForeignKey(d => d.QuestionId)
                .HasConstraintName("FK__ANSWER_OP__quest__48CFD27E");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CATEGORY__3213E83FD449D06C");

            entity.ToTable("CATEGORY");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Dimension>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DIMENSIO__3213E83FA2D3E939");

            entity.ToTable("DIMENSION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SubjectId).HasColumnName("subject_id");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");

            entity.HasOne(d => d.Subject).WithMany(p => p.Dimensions)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__DIMENSION__subje__49C3F6B7");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__LESSON__3213E83FE892149F");

            entity.ToTable("LESSON");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.SubjectId).HasColumnName("subject_id");
            entity.Property(e => e.Url)
                .HasMaxLength(255)
                .HasColumnName("url");

            entity.HasOne(d => d.Subject).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__LESSON__subject___4AB81AF0");
        });

        modelBuilder.Entity<LessonCompletion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__LESSON_C__3213E83F76E720A9");

            entity.ToTable("LESSON_COMPLETION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CompletionDate)
                .HasColumnType("datetime")
                .HasColumnName("completion_date");
            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Lesson).WithMany(p => p.LessonCompletions)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LESSON_CO__lesso__4BAC3F29");

            entity.HasOne(d => d.User).WithMany(p => p.LessonCompletions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LESSON_CO__user___4CA06362");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__POST__3213E83F6FFA6220");

            entity.ToTable("POST");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BriefInfo).HasColumnName("brief_info");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");

            entity.HasOne(d => d.Category).WithMany(p => p.Posts)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__POST__category_i__4D94879B");
        });

        modelBuilder.Entity<PostContent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__POST_CON__3213E83F99410CE3");

            entity.ToTable("POST_CONTENT");

            entity.HasIndex(e => e.PostId, "idx_post_content_post_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.PostId).HasColumnName("post_id");

            entity.HasOne(d => d.Post).WithMany(p => p.PostContents)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__POST_CONT__post___4E88ABD4");
        });

        modelBuilder.Entity<PostImage>(entity =>
        {
            entity.ToTable("POST_IMAGES");

            entity.HasIndex(e => e.PostId, "idx_post_images_post_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.Url)
                .HasColumnType("text")
                .HasColumnName("url");

            entity.HasOne(d => d.Post).WithMany(p => p.PostImages)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__POST_IMAG__post___4F7CD00D");
        });

        modelBuilder.Entity<PricePackage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PRICE_PA__3213E83FE511C218");

            entity.ToTable("PRICE_PACKAGE");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DurationMonths).HasColumnName("duration_months");
            entity.Property(e => e.ListPrice)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("list_price");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.SalePrice)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("sale_price");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.SubjectId).HasColumnName("subject_id");

            entity.HasOne(d => d.Subject).WithMany(p => p.PricePackages)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__PRICE_PAC__subje__5070F446");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QUESTION__3213E83F01EC2715");

            entity.ToTable("QUESTION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.MediaUrl)
                .HasMaxLength(255)
                .HasColumnName("media_url");
            entity.Property(e => e.QuizId).HasColumnName("quiz_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");

            entity.HasOne(d => d.Quiz).WithMany(p => p.Questions)
                .HasForeignKey(d => d.QuizId)
                .HasConstraintName("FK__QUESTION__quiz_i__5165187F");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QUIZ__3213E83FBA4EE48E");

            entity.ToTable("QUIZ");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DurationMinutes).HasColumnName("duration_minutes");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.PassRate)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("pass_rate");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.SubjectId).HasColumnName("subject_id");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");

            entity.HasOne(d => d.Subject).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__QUIZ__subject_id__52593CB8");
        });

        modelBuilder.Entity<QuizAttempt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QUIZ_ATT__3213E83F29B71C3B");

            entity.ToTable("QUIZ_ATTEMPT");

            entity.HasIndex(e => new { e.UserId, e.QuizId }, "IX_QUIZ_ATTEMPT_USER_QUIZ");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AttemptNumber).HasColumnName("attempt_number");
            entity.Property(e => e.EndTime)
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.QuizId).HasColumnName("quiz_id");
            entity.Property(e => e.Score)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("score");
            entity.Property(e => e.StartTime)
                .HasColumnType("datetime")
                .HasColumnName("start_time");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Quiz).WithMany(p => p.QuizAttempts)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QUIZ_ATTE__quiz___534D60F1");

            entity.HasOne(d => d.User).WithMany(p => p.QuizAttempts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QUIZ_ATTE__user___5441852A");
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__REGISTRA__3213E83F29CD829B");

            entity.ToTable("REGISTRATION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PackageId).HasColumnName("package_id");
            entity.Property(e => e.RegistrationTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("registration_time");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.SubjectId).HasColumnName("subject_id");
            entity.Property(e => e.TotalCost)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total_cost");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ValidFrom)
                .HasColumnType("date")
                .HasColumnName("valid_from");
            entity.Property(e => e.ValidTo)
                .HasColumnType("date")
                .HasColumnName("valid_to");

            entity.HasOne(d => d.Package).WithMany(p => p.Registrations)
                .HasForeignKey(d => d.PackageId)
                .HasConstraintName("FK__REGISTRAT__packa__5535A963");

            entity.HasOne(d => d.Subject).WithMany(p => p.Registrations)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__REGISTRAT__subje__5629CD9C");

            entity.HasOne(d => d.User).WithMany(p => p.Registrations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__REGISTRAT__user___571DF1D5");
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SUBJECT__3213E83F4BC54F52");

            entity.ToTable("SUBJECT");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.OwnerId).HasColumnName("owner_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.Thumbnail)
                .HasMaxLength(255)
                .HasColumnName("thumbnail");

            entity.HasOne(d => d.Category).WithMany(p => p.Subjects)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__SUBJECT__categor__5812160E");

            entity.HasOne(d => d.Owner).WithMany(p => p.Subjects)
                .HasForeignKey(d => d.OwnerId)
                .HasConstraintName("FK__SUBJECT__owner_i__59063A47");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__USER__3213E83F73B50D61");

            entity.ToTable("USER");

            entity.HasIndex(e => e.Email, "UQ__USER__AB6E61646BE96FE5").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Avatar)
                .HasMaxLength(255)
                .HasColumnName("avatar");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("first_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("last_name");
            entity.Property(e => e.MidName)
                .HasMaxLength(50)
                .HasColumnName("mid_name");
            entity.Property(e => e.Mobile)
                .HasMaxLength(20)
                .HasColumnName("mobile");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasColumnName("role");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
        });

        modelBuilder.Entity<UserAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__USER_ANS__3213E83FED2BD6AC");

            entity.ToTable("USER_ANSWER");

            entity.HasIndex(e => e.QuizAttemptId, "IX_USER_ANSWER_QUIZ_ATTEMPT");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnswerOptionId).HasColumnName("answer_option_id");
            entity.Property(e => e.CorrectAnswerContent).HasColumnName("correct_answer_content");
            entity.Property(e => e.IsCorrect).HasColumnName("is_correct");
            entity.Property(e => e.QuestionContent).HasColumnName("question_content");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");
            entity.Property(e => e.QuizAttemptId).HasColumnName("quiz_attempt_id");
            entity.Property(e => e.SelectedAnswerContent).HasColumnName("selected_answer_content");

            entity.HasOne(d => d.AnswerOption).WithMany(p => p.UserAnswers)
                .HasForeignKey(d => d.AnswerOptionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__USER_ANSW__answe__59FA5E80");

            entity.HasOne(d => d.Question).WithMany(p => p.UserAnswers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__USER_ANSW__quest__5AEE82B9");

            entity.HasOne(d => d.QuizAttempt).WithMany(p => p.UserAnswers)
                .HasForeignKey(d => d.QuizAttemptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__USER_ANSW__quiz___5BE2A6F2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
