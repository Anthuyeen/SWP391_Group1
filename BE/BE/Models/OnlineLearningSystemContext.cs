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

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<PricePackage> PricePackages { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<Registration> Registrations { get; set; }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var ConnectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(ConnectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AnswerOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ANSWER_O__3213E83F9F8CAB0E");

            entity.ToTable("ANSWER_OPTION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.IsCorrect).HasColumnName("is_correct");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");

            entity.HasOne(d => d.Question).WithMany(p => p.AnswerOptions)
                .HasForeignKey(d => d.QuestionId)
                .HasConstraintName("FK__ANSWER_OP__quest__49C3F6B7");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CATEGORY__3213E83F9EC9D7C8");

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
            entity.HasKey(e => e.Id).HasName("PK__DIMENSIO__3213E83F3C9184F7");

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
                .HasConstraintName("FK__DIMENSION__subje__4222D4EF");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__LESSON__3213E83F7E1F7788");

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

            entity.HasOne(d => d.Subject).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__LESSON__subject___33D4B598");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__POST__3213E83F73714738");

            entity.ToTable("POST");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BriefInfo).HasColumnName("brief_info");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.Thumbnail)
                .HasMaxLength(255)
                .HasColumnName("thumbnail");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");

            entity.HasOne(d => d.Category).WithMany(p => p.Posts)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__POST__category_i__571DF1D5");
        });

        modelBuilder.Entity<PricePackage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PRICE_PA__3213E83FF9356FAA");

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
                .HasConstraintName("FK__PRICE_PAC__subje__37A5467C");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QUESTION__3213E83FF7053BE8");

            entity.ToTable("QUESTION");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Explanation).HasColumnName("explanation");
            entity.Property(e => e.Level)
                .HasMaxLength(20)
                .HasColumnName("level");
            entity.Property(e => e.MediaUrl)
                .HasMaxLength(255)
                .HasColumnName("media_url");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QUIZ__3213E83F25618140");

            entity.ToTable("QUIZ");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DurationMinutes).HasColumnName("duration_minutes");
            entity.Property(e => e.Level)
                .HasMaxLength(20)
                .HasColumnName("level");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.PassRate)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("pass_rate");
            entity.Property(e => e.SubjectId).HasColumnName("subject_id");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");

            entity.HasOne(d => d.Subject).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__QUIZ__subject_id__4E88ABD4");

            entity.HasMany(d => d.Questions).WithMany(p => p.Quizzes)
                .UsingEntity<Dictionary<string, object>>(
                    "QuizQuestion",
                    r => r.HasOne<Question>().WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__QUIZ_QUES__quest__52593CB8"),
                    l => l.HasOne<Quiz>().WithMany()
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__QUIZ_QUES__quiz___5165187F"),
                    j =>
                    {
                        j.HasKey("QuizId", "QuestionId").HasName("PK__QUIZ_QUE__AF9C72B8751AD5E4");
                        j.ToTable("QUIZ_QUESTION");
                    });
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__REGISTRA__3213E83F0A0A83B7");

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
                .HasConstraintName("FK__REGISTRAT__packa__3E52440B");

            entity.HasOne(d => d.Subject).WithMany(p => p.Registrations)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__REGISTRAT__subje__3D5E1FD2");

            entity.HasOne(d => d.User).WithMany(p => p.Registrations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__REGISTRAT__user___3C69FB99");
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SUBJECT__3213E83F4903F857");

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
                .HasConstraintName("FK__SUBJECT__categor__2F10007B");

            entity.HasOne(d => d.Owner).WithMany(p => p.Subjects)
                .HasForeignKey(d => d.OwnerId)
                .HasConstraintName("FK__SUBJECT__owner_i__300424B4");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__USER__3213E83FE38D21C0");

            entity.ToTable("USER");

            entity.HasIndex(e => e.Email, "UQ__USER__AB6E6164CE31BACA").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Avatar)
                .HasMaxLength(255)
                .HasColumnName("avatar");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
